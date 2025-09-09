import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import SellerList from './components/SellerList';
import ProductDetail from './components/ProductDetail';


function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sellers" element={<SellerList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;