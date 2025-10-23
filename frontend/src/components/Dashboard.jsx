import React, { useState, useEffect } from 'react';
import { DollarSign, Leaf, TrendingUp, Package } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSavings: 0,
    environmentalImpact: 0,
    productsScanned: 0,
    sustainabilityScore: 0
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Dashboard LiquiVerde
        </h1>
        <p className="text-lg text-green-600">
          Ahorra dinero mientras cuidas el planeta
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ahorro Total</p>
              <p className="text-2xl font-bold text-green-700">${stats.totalSavings}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Impacto Ambiental</p>
              <p className="text-2xl font-bold text-blue-700">{stats.environmentalImpact}kg CO₂</p>
            </div>
            <Leaf className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos Escaneados</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.productsScanned}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Puntuación Sostenible</p>
              <p className="text-2xl font-bold text-purple-700">{stats.sustainabilityScore}/10</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
            onClick={() => window.location.href = '/scanner'}
          >
            Escanear Producto
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
            onClick={() => window.location.href = '/shopping-list'}
          >
            Crear Lista de Compras
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;