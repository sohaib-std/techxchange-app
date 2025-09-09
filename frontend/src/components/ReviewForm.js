import React, { useState } from 'react';
import { reviewService } from '../services/api';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    reviewerName: '',
    reviewText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.reviewerName.trim() || !formData.reviewText.trim()) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      // Send the review to the backend API
      await reviewService.create({
        productId, // This comes from the props
        rating: parseInt(formData.rating),
        reviewerName: formData.reviewerName,
        reviewText: formData.reviewText
      });

      // Reset form and notify parent component
      setFormData({ rating: 5, reviewerName: '', reviewText: '' });
      setError('');
      if (onReviewSubmitted) {
        onReviewSubmitted(); // This callback will refresh the reviews
      }
      alert('Review submitted successfully!');

    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
      {error && <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Select */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="reviewerName"
            name="reviewerName"
            value={formData.reviewerName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Review Text Input */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="reviewText"
            name="reviewText"
            rows="4"
            value={formData.reviewText}
            onChange={handleChange}
            placeholder="Share your experience with this product..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;