import React from 'react';

const ProductCard = ({ product }) => {
  // Check if product and seller exist to avoid errors
  if (!product || !product.seller) {
    return <div>Loading product information...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {product.category}
          </span>
          <span className="text-lg font-bold text-green-600">£{product.price}</span>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Sold by: <span className="font-medium text-gray-700">{product.seller.name}</span>
          </p>
          <p className="text-sm text-gray-500">{product.seller.location}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;