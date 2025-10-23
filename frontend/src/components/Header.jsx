import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Scan, ShoppingCart, BarChart3, MapPin, Trophy } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8" />
            <h1 className="text-2xl font-bold">LiquiVerde</h1>
          </div>
          
          <nav className="flex flex-wrap gap-2 md:gap-6 justify-center">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/') ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-500'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/scanner" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/scanner') ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-500'
              }`}
            >
              <Scan className="h-5 w-5" />
              <span>Escanear</span>
            </Link>
            <Link 
              to="/shopping-list" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/shopping-list') ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-500'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Lista de Compras</span>
            </Link>
            <Link 
              to="/store-finder" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                isActive('/store-finder') ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-500'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>Encuentra Tiendas</span>
            </Link>
            <Link 
  to="/rewards" 
  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
    isActive('/rewards') ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-500'
  }`}
>
  <Trophy className="h-5 w-5" />
  <span>Recompensas</span>
</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;