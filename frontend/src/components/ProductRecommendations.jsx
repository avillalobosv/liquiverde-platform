import React, { useState } from 'react';
import { TrendingUp, DollarSign, Leaf, ArrowRight } from 'lucide-react';

const ProductRecommendations = ({ barcode }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/product-recommendations/${barcode}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!barcode) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-green-800">Alternativas Más Sostenibles</h3>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <TrendingUp className="h-4 w-4" />
          <span>{loading ? 'Buscando...' : 'Ver Alternativas'}</span>
        </button>
      </div>

      {recommendations && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Producto Actual:</h4>
            <p>{recommendations.current_product.name} (Sostenibilidad: {recommendations.current_product.sustainability_score}/10)</p>
          </div>

          {recommendations.recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-800">{rec.name}</h4>
                  <p className="text-sm text-gray-600">{rec.brand}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">${rec.price}</p>
                  <p className={`text-sm ${rec.price_difference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rec.price_difference <= 0 ? 'Más barato' : 'Más caro'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span>Sostenibilidad: <strong>{rec.sustainability_score}/10</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Mejora: <strong>+{rec.sustainability_improvement}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span>Diferencia: <strong>${Math.abs(rec.price_difference)}</strong></span>
                </div>
                <div className="text-green-600 font-semibold">
                  +{rec.improvement_percentage}% mejor
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;