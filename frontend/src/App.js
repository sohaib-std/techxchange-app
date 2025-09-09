import React from 'react';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">TechXChange</h1>
        </div>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;