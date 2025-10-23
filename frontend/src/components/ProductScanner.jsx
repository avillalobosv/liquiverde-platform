import React, { useState } from 'react';
import { Scan, Search, Package, List, ImageOff } from 'lucide-react';
import ProductRecommendations from './ProductRecommendations';

const ProductScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!barcode.trim()) return;
    
    setLoading(true);
    setError('');
    setProduct(null);
    setSearchResults([]);
    
    try {
      const response = await fetch(`/api/product/${barcode}`);
      
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Producto no encontrado');
      }
      
    } catch (error) {
      console.error('Error buscando producto:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSearch = async () => {
    if (!barcode.trim()) return;
    
    setSearchLoading(true);
    setError('');
    setProduct(null);
    
    try {
      const response = await fetch(`/api/search-products/${encodeURIComponent(barcode)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setSearchResults(data.products);
        } else {
          setError('No se encontraron productos con ese nombre');
        }
      } else {
        setError('Error en la búsqueda por nombre');
      }
    } catch (error) {
      console.error('Error en búsqueda por nombre:', error);
      setError('Error en la búsqueda');
    } finally {
      setSearchLoading(false);
    }
  };

  const selectProductFromSearch = (product) => {
    setProduct({
      ...product,
      price: product.price || Math.floor(Math.random() * 5000) + 500,
      health_score: product.health_score || (Math.random() * 4 + 6).toFixed(1),
      carbon_footprint: product.carbon_footprint || ((10 - product.sustainability_score) / 2).toFixed(1)
    });
    setSearchResults([]);
    setBarcode(product.barcode || '');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Escáner de Productos</h1>
        <p className="text-green-600">Busca por código de barras o nombre del producto</p>
      </div>

      {/* Input de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Ingresa código de barras o nombre del producto..."
              className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Scan className="animate-pulse" /> : <Search />}
            <span>{loading ? 'Buscando...' : 'Por Código'}</span>
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleNameSearch}
            disabled={searchLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50 mx-auto"
          >
            {searchLoading ? <List className="animate-pulse" /> : <List />}
            <span>{searchLoading ? 'Buscando...' : 'Buscar por Nombre'}</span>
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Resultados de búsqueda por nombre */}
      {searchResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Resultados de búsqueda ({searchResults.length} productos)
          </h3>
          <div className="space-y-3">
            {searchResults.map((product, index) => (
              <button
                key={index}
                onClick={() => selectProductFromSearch(product)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 transition duration-200"
              >
                <div className="flex items-center space-x-4">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className={`flex-1 ${!product.image_url ? 'flex items-center space-x-4' : ''}`}>
                    {!product.image_url && (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      product.sustainability_score >= 8 ? 'bg-green-100 text-green-800' :
                      product.sustainability_score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Sostenibilidad: {product.sustainability_score}/10
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultado del producto */}
      {product && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <div className="flex items-start space-x-6 mb-4">
            {/* Imagen del producto */}
            <div className="flex-shrink-0">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {!product.image_url && (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <ImageOff className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Información del producto */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Package className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="text-xl font-bold text-green-800">{product.name}</h3>
                  <p className="text-gray-600">{product.brand}</p>
                  <p className="text-sm text-gray-500">
                    Categoría: {product.category.split(',')[0]} • Fuente: {product.source}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Precio</p>
                  <p className="text-lg font-bold text-green-800">${product.price}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Sostenibilidad</p>
                  <p className="text-lg font-bold text-blue-800">{product.sustainability_score}/10</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600">Salud</p>
                  <p className="text-lg font-bold text-yellow-800">{product.health_score}/10</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Huella de Carbono</p>
                  <p className="text-lg font-bold text-red-800">{product.carbon_footprint}kg CO₂</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {product && product.barcode && (
        <ProductRecommendations barcode={product.barcode} />
      )}

      {/* Productos de ejemplo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Prueba con estos códigos (tienen imágenes):</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-gray-700 mb-2">Códigos con imágenes:</p>
            <div className="space-y-1">
              <button onClick={() => setBarcode('3017620422003')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • 3017620422003 - Nutella (tiene imagen)
              </button>
              <button onClick={() => setBarcode('7613035540354')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • 7613035540354 - Coca Cola (tiene imagen)
              </button>
              <button onClick={() => setBarcode('3033710065967')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • 3033710065967 - Agua Evian (tiene imagen)
              </button>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">Nombres para buscar:</p>
            <div className="space-y-1">
              <button onClick={() => setBarcode('nutella')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • nutella
              </button>
              <button onClick={() => setBarcode('yogurt')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • yogurt
              </button>
              <button onClick={() => setBarcode('chocolate')} className="text-blue-500 hover:text-blue-700 block text-sm">
                • chocolate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScanner;