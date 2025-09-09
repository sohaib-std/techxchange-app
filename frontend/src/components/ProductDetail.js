import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import ReviewForm from './ReviewForm';

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh reviews after a new one is submitted
  const handleReviewSubmitted = () => {
    fetchProduct(); // Re-fetch the product to get the updated reviews list
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-xl text-gray-600">Loading product...</div>;
  if (error) return <div className="text-center py-12 text-xl text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-12 text-xl text-gray-600">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Product Info */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
        <p className="text-gray-600 text-lg mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
            {product.category}
          </span>
          <span className="text-2xl font-bold text-green-600">£{product.price}</span>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Sold by</h2>
          <p className="text-gray-800">{product.sellerId?.name}</p>
          <p className="text-gray-600">{product.sellerId?.location}</p>
          <p className="text-gray-600">{product.sellerId?.email}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id || review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800 mr-4">{review.reviewerName}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-gray-600">{review.reviewText}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review Form */}
      <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
};

export default ProductDetail;