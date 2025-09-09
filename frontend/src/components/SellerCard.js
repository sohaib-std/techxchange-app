import React from 'react';

const SellerCard = ({ seller }) => {
  if (!seller) {
    return <div>Loading seller information...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{seller.name}</h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Location:</span> {seller.location}
      </p>
      <p className="text-gray-600 mb-4">
        <span className="font-medium">Contact:</span> {seller.email}
      </p>
      <div className="pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{seller.products ? seller.products.length : 0}</span> products listed
        </p>
      </div>
    </div>
  );
};

export default SellerCard;