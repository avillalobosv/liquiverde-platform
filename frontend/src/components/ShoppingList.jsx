import React, { useState, useEffect } from 'react';
import { ShoppingCart, Filter, RefreshCw, AlertCircle, Package } from 'lucide-react';

const ShoppingList = () => {
  const [budget, setBudget] = useState(10000);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [optimizedList, setOptimizedList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar categorías disponibles
  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  const fetchAvailableCategories = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Error cargando categorías');
      
      const data = await response.json();
      const uniqueCategories = [...new Set(data.products.map(p => p[7]))].filter(Boolean);
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setAvailableCategories(['Lácteos', 'Panadería', 'Frutas', 'Granos', 'Pescado', 'Limpieza', 'Bebidas']);
    }
  };

  const optimizeShoppingList = async () => {
    setLoading(true);
    setError('');
    setOptimizedList(null);
    
    try {
      console.log('🔄 Optimizando con presupuesto:', budget);
      
      const requestBody = {
        budget: budget,
        categories: categories.length > 0 ? categories : null
      };
      
      console.log('📦 Enviando datos:', requestBody);
      
      const response = await fetch('/api/optimize-shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📡 Status de respuesta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Resultado recibido:', result);
      
      // Validar que la respuesta tenga la estructura correcta
      if (!result.optimized_products) {
        throw new Error('Respuesta del servidor incompleta');
      }
      
      setOptimizedList(result);
      
    } catch (error) {
      console.error('❌ Error optimizando lista:', error);
      setError(`Error al optimizar la lista: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Lista de Compras Optimizada</h1>
        <p className="text-green-600">Crea y optimiza tu lista de compras para máximo ahorro y sostenibilidad</p>
      </div>

      {/* Presupuesto */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Presupuesto</h2>
        <div className="flex items-center space-x-4">
          <label className="text-lg font-medium text-gray-700">Presupuesto:</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            min="1000"
            step="500"
          />
          <span className="text-gray-600">CLP</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 Recomendación: Presupuesto mínimo $5,000 para mejores resultados
        </p>
      </div>

      {/* Filtros de categoría */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <Filter className="mr-2" />
          Filtrar por Categoría (Opcional)
        </h2>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-lg border transition ${
                categories.includes(category)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            Filtrado: {categories.join(', ')}
          </p>
        )}
      </div>

      {/* Botón de optimización */}
      <div className="text-center">
        <button
          onClick={optimizeShoppingList}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2 mx-auto disabled:opacity-50 transition duration-200"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <ShoppingCart />}
          <span>{loading ? 'Optimizando...' : 'Optimizar Lista de Compras'}</span>
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Resultado optimizado */}
      {optimizedList && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <Package className="mr-2" />
            Lista Optimizada
            {optimizedList.message && (
              <span className="text-sm font-normal text-green-600 ml-2">
                - {optimizedList.message}
              </span>
            )}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Costo Total</p>
              <p className="text-xl font-bold text-green-800">${optimizedList.total_cost}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Ahorro Total</p>
              <p className="text-xl font-bold text-blue-800">${optimizedList.total_savings}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Sostenibilidad Promedio</p>
              <p className="text-xl font-bold text-purple-800">{optimizedList.average_sustainability}/10</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Huella de Carbono</p>
              <p className="text-xl font-bold text-red-800">{optimizedList.total_carbon_footprint}kg CO₂</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Productos Recomendados ({optimizedList.products_count} productos):
          </h3>
          
          {/* ✅ MANEJO SEGURO - Verificar que optimized_products existe */}
          {optimizedList.optimized_products && optimizedList.optimized_products.length > 0 ? (
            <div className="space-y-3">
              {optimizedList.optimized_products.map((product, index) => (
                <div key={product.id || index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:bg-green-50 transition duration-200">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                    <div className="flex space-x-4 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Sostenibilidad: {product.sustainability_score}/10
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Salud: {product.health_score}/10
                      </span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        CO₂: {product.carbon_footprint}kg
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-green-700 text-lg">${product.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <Package className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-yellow-800 font-semibold">No se encontraron productos que cumplan con los criterios</p>
              <p className="text-yellow-600 text-sm mt-2">
                Intenta aumentar el presupuesto o quitar algunos filtros de categoría
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información del algoritmo */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Algoritmo de Mochila Multi-objetivo</h3>
        <p className="text-yellow-700 mb-2">
          Optimizamos tu compra considerando múltiples objetivos: 
        </p>
        <ul className="text-yellow-700 list-disc list-inside space-y-1">
          <li>💰 Precio (40% de importancia)</li>
          <li>🌱 Sostenibilidad (30% de importancia)</li>
          <li>❤️ Salud (20% de importancia)</li>
          <li>🌍 Huella de Carbono (10% de importancia)</li>
        </ul>
      </div>
    </div>
  );
};

export default ShoppingList;