import React, { useState } from 'react';

const DebugScanner = () => {
  const [barcode, setBarcode] = useState('3017620422003');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testAllEndpoints = async () => {
    setLoading(true);
    setResults([]);
    
    const endpoints = [
      { name: 'localhost:8000', url: `http://localhost:8000/product/${barcode}` },
      { name: '127.0.0.1:8000', url: `http://127.0.0.1:8000/product/${barcode}` },
      { name: 'Proxy /api', url: `/api/product/${barcode}` }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Probando: ${endpoint.name}`);
        const startTime = Date.now();
        
        const response = await fetch(endpoint.url);
        const data = await response.json();
        const responseTime = Date.now() - startTime;
        
        setResults(prev => [...prev, {
          endpoint: endpoint.name,
          status: response.status,
          ok: response.ok,
          time: responseTime,
          data: data,
          error: null
        }]);
        
        console.log(`✅ ${endpoint.name}: OK (${responseTime}ms)`);
      } catch (error) {
        setResults(prev => [...prev, {
          endpoint: endpoint.name,
          status: 'ERROR',
          ok: false,
          time: 0,
          data: null,
          error: error.toString()
        }]);
        console.log(`❌ ${endpoint.name}: ${error}`);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">🔧 DEBUG CONEXIÓN BACKEND</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1 px-4 py-2 border border-yellow-300 rounded"
            placeholder="Código de barras"
          />
          <button
            onClick={testAllEndpoints}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-semibold"
          >
            {loading ? 'Probando...' : 'Test Todas las Conexiones'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Resultados:</h3>
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded border ${
                result.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{result.endpoint}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {result.ok ? `✅ OK (${result.time}ms)` : '❌ ERROR'}
                  </span>
                </div>
                {result.error ? (
                  <pre className="text-sm text-red-600">{result.error}</pre>
                ) : (
                  <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugScanner;