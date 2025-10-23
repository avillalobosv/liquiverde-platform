import React, { useState } from 'react';
import { MapPin, Navigation, Store, Route, Compass } from 'lucide-react';

const StoreFinder = () => {
  const [location, setLocation] = useState({ lat: -33.4489, lon: -70.6693 });
  const [stores, setStores] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const findNearbyStores = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/nearby-stores?lat=${location.lat}&lon=${location.lon}&radius_km=5`);
      const data = await response.json();
      setStores(data.stores);
      setOptimizedRoute(null); // Resetear ruta anterior
    } catch (error) {
      console.error('Error buscando tiendas:', error);
      // Datos de ejemplo si falla la API
      setStores([
        {
          "name": "Supermercado Central",
          "address": "Av. Principal 123, Santiago",
          "distance": 1.2,
          "products_available": 150,
          "sustainability_rating": 7.5,
          "coordinates": {"lat": -33.449, "lon": -70.668}
        },
        {
          "name": "EcoMarket Verde",
          "address": "Calle Sustentable 456, Santiago", 
          "distance": 2.8,
          "products_available": 80,
          "sustainability_rating": 9.2,
          "coordinates": {"lat": -33.447, "lon": -70.671}
        },
        {
          "name": "Mercado Local",
          "address": "Plaza Central 789, Santiago",
          "distance": 0.8,
          "products_available": 60,
          "sustainability_rating": 8.0,
          "coordinates": {"lat": -33.448, "lon": -70.667}
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const optimizeRoute = async () => {
    if (stores.length === 0) return;
    
    setLoading(true);
    try {
      // Productos de ejemplo del carrito
      const mockProducts = [
        { name: 'Leche Entera', price: 1200, sustainability_score: 7.5 },
        { name: 'Pan Integral', price: 2500, sustainability_score: 8.0 },
        { name: 'Manzanas', price: 1500, sustainability_score: 9.0 },
        { name: 'Yogurt Natural', price: 800, sustainability_score: 6.5 },
        { name: 'Arroz Integral', price: 2200, sustainability_score: 7.0 }
      ];
      
      const response = await fetch('http://localhost:8000/optimize-shopping-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stores: stores.slice(0, 3), // Usar solo las 3 primeras tiendas
          products: mockProducts 
        })
      });
      
      const data = await response.json();
      setOptimizedRoute(data);
    } catch (error) {
      console.error('Error optimizando ruta:', error);
      // Ruta optimizada de ejemplo
      setOptimizedRoute({
        "optimized_route": stores.slice(0, 2).map((store, index) => ({
          "store": store,
          "products_to_buy": [
            { name: 'Producto ' + (index + 1), price: 1000 + index * 500 },
            { name: 'Producto ' + (index + 2), price: 1200 + index * 500 }
          ],
          "estimated_savings": 200 + index * 100,
          "distance_from_previous": store.distance
        })),
        "total_distance_km": 3.5,
        "total_estimated_savings": 450,
        "products_remaining": 1,
        "efficiency_score": 80.0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Encuentra Tiendas Sostenibles</h1>
        <p className="text-green-600">Descubre tiendas cercanas y optimiza tu ruta de compras</p>
      </div>

      {/* Selector de ubicación */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Compass className="inline w-4 h-4 mr-1" />
              Tu ubicación (coordenadas de Santiago)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.0001"
                value={location.lat}
                onChange={(e) => setLocation(prev => ({...prev, lat: parseFloat(e.target.value) || -33.4489}))}
                placeholder="Latitud"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.0001"
                value={location.lon}
                onChange={(e) => setLocation(prev => ({...prev, lon: parseFloat(e.target.value) || -70.6693}))}
                placeholder="Longitud"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Coordenadas predefinidas: Santiago Centro (-33.4489, -70.6693)
            </p>
          </div>
          <button
            onClick={findNearbyStores}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
          >
            <MapPin className="h-5 w-5" />
            <span>{loading ? 'Buscando...' : 'Buscar Tiendas'}</span>
          </button>
        </div>
      </div>

      {/* Tiendas encontradas */}
      {stores.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Store className="mr-2" />
            Tiendas Cercanas ({stores.length})
          </h2>
          
          <div className="space-y-4">
            {stores.map((store, index) => (
              <div key={index} className="flex justify-between items-start p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition duration-200">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.address}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {store.distance} km
                        </span>
                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                          🌱 {store.sustainability_rating.toFixed(1)}/10
                        </span>
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                          🛒 {store.products_available} productos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimización de ruta */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={optimizeRoute}
              disabled={loading || stores.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto disabled:opacity-50"
            >
              <Route className="h-5 w-5" />
              <span>{loading ? 'Optimizando...' : 'Optimizar Ruta de Compras'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Ruta optimizada */}
      {optimizedRoute && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <Navigation className="mr-2" />
            Ruta Optimizada de Compras
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Distancia Total</p>
              <p className="text-xl font-bold text-blue-800">{optimizedRoute.total_distance_km} km</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Ahorro Estimado</p>
              <p className="text-xl font-bold text-green-800">${optimizedRoute.total_estimated_savings}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Eficiencia</p>
              <p className="text-xl font-bold text-purple-800">{optimizedRoute.efficiency_score}%</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tu itinerario optimizado:</h3>
          <div className="space-y-4">
            {optimizedRoute.optimized_route.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">{step.store.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{step.store.address}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="font-medium text-green-700">Ahorro estimado: </span>
                      <span className="text-green-600">${step.estimated_savings.toFixed(0)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-blue-700">Distancia: </span>
                      <span className="text-blue-600">{step.distance_from_previous} km</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Productos recomendados aquí:</p>
                    <div className="flex flex-wrap gap-2">
                      {step.products_to_buy.map((product, idx) => (
                        <span key={idx} className="text-xs bg-white px-3 py-1 rounded-full border border-green-200 text-green-700">
                          {product.name} (${product.price})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {optimizedRoute.products_remaining > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Nota:</strong> {optimizedRoute.products_remaining} producto(s) no se encontraron en las tiendas cercanas. 
                Considera expandir tu búsqueda a un radio mayor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-2">💡 ¿Cómo funciona?</h3>
        <ul className="text-green-700 space-y-1 text-sm">
          <li>• Busca tiendas sostenibles cerca de tu ubicación</li>
          <li>• Optimiza tu ruta para ahorrar tiempo y combustible</li>
          <li>• Descubre tiendas con mejor puntuación ecológica</li>
          <li>• Maximiza tus ahorros comprando en las tiendas correctas</li>
        </ul>
      </div>
    </div>
  );
};

export default StoreFinder;