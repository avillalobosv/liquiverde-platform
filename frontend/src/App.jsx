import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductScanner from './components/ProductScanner';
import Dashboard from './components/Dashboard';
import ShoppingList from './components/ShoppingList';
import StoreFinder from './components/StoreFinder';
import RewardsSystem from './components/RewardsSystem';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-green-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<ProductScanner />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/store-finder" element={<StoreFinder />} />
            <Route path="/rewards" element={<RewardsSystem />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;