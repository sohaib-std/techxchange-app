import React, { useState, useEffect } from 'react';
import { sellerService } from '../services/api';
import SellerCard from './SellerCard';

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await sellerService.getAll();
        setSellers(response.data);
      } catch (err) {
        setError('Failed to load sellers. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) return <div className="text-center py-12 text-xl text-gray-600">Loading sellers...</div>;
  if (error) return <div className="text-center py-12 text-xl text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Trusted Sellers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <SellerCard key={seller.id} seller={seller} />
        ))}
      </div>
    </div>
  );
};

export default SellerList;