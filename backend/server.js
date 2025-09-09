const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend-backend communication
app.use(express.json()); // Parse incoming JSON requests

// Basic root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'TechXChange Server is running successfully!' });
});

// SIMULATED DATA (For Pass Grade - we will replace this with a database later)
const products = [
  {
    id: 1,
    name: "Apple MacBook Pro 16\"",
    description: "10-core CPU, 32-core GPU, 32GB Unified Memory, 1TB SSD Storage.",
    category: "Laptops",
    price: 2499.99,
    sellerId: 1
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life.",
    category: "Audio",
    price: 328.99,
    sellerId: 2
  }
];

const sellers = [
  {
    id: 1,
    name: "TechGuru Ltd.",
    location: "London, UK",
    email: "contact@techguru.co.uk"
  },
  {
    id: 2,
    name: "AudioVisual Experts",
    location: "Manchester, UK",
    email: "sales@av-experts.com"
  }
];

const reviews = [
  {
    id: 1,
    productId: 1,
    rating: 5,
    reviewerName: "Jane Doe",
    reviewText: "Incredible performance for video editing. The battery life is outstanding."
  },
  {
    id: 2,
    productId: 2,
    rating: 4,
    reviewerName: "John Smith",
    reviewText: "The noise cancellation is mind-blowing. Comfortable for long flights."
  }
];

// API ROUTES

// GET /api/products - Fetch all products
app.get('/api/products', (req, res) => {
  try {
    // Map product data to include seller details (a simple join)
    const productsWithSellers = products.map(product => {
      const seller = sellers.find(s => s.id === product.sellerId);
      return { ...product, seller };
    });
    res.json(productsWithSellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// GET /api/products/:id - Fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const seller = sellers.find(s => s.id === product.sellerId);
    const productReviews = reviews.filter(r => r.productId === productId);

    res.json({ ...product, seller, reviews: productReviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// GET /api/sellers - Fetch all sellers
app.get('/api/sellers', (req, res) => {
  try {
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
});

// GET /api/sellers/:id - Fetch a single seller by ID
app.get('/api/sellers/:id', (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = sellers.find(s => s.id === sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    res.json({ ...seller, products: sellerProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});