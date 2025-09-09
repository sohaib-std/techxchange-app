const axios = require('axios');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database'); // Import DB connection

const authRoutes = require('./routes/auth');
const { protect, authorize } = require('./middleware/auth');
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const Product = require('./models/Product');
const Seller = require('./models/Seller');
const Review = require('./models/Review');
const User = require('./models/User');

// Basic root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'TechXChange Server with MongoDB is running!' });
});

// API ROUTES - NOW USING DATABASE!

// GET /api/products - Fetch all products with seller details
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name location email'); // Populate seller info
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// GET /api/products/:id - Fetch a single product by ID with seller and reviews
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Find reviews for this product
    const productReviews = await Review.find({ productId: req.params.id }).populate('userId', 'username');
    res.json({ ...product.toObject(), reviews: productReviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// GET /api/sellers - Fetch all sellers
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
});

// GET /api/sellers/:id - Fetch a single seller by ID with their products
app.get('/api/sellers/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    // Find products by this seller
    const sellerProducts = await Product.find({ sellerId: req.params.id });
    res.json({ ...seller.toObject(), products: sellerProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller", error: error.message });
  }
});

// POST /api/reviews - Submit a new review
app.post('/api/reviews', protect, async (req, res) => { // Added 'protect' middleware
    try {
      const { productId, rating, reviewText } = req.body; // Removed reviewerName
  
      // Basic validation
      if (!productId || !rating || !reviewText) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newReview = new Review({
        productId,
        userId: req.user.id, // Use the ID from the authenticated user
        rating,
        reviewText
      });
  
      const savedReview = await newReview.save();
      // Populate user info before sending back the response
      await savedReview.populate('userId', 'username'); 
      res.status(201).json(savedReview);
  
    } catch (error) {
      res.status(500).json({ message: "Error submitting review", error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
      const { name, description, category, price, sellerId } = req.body;
  
      // Basic validation
      if (!name || !description || !category || !price || !sellerId) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newProduct = new Product({
        name,
        description,
        category,
        price,
        sellerId
      });
  
      const savedProduct = await newProduct.save();
      // Populate seller info before sending back the response
      await savedProduct.populate('sellerId', 'name location email');
      res.status(201).json(savedProduct);
  
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  });

app.use('/api/auth', authRoutes);
app.get('/api/auth/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching profile", error: error.message });
    }
  });

app.get('/api/news', async (req, res) => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          category: 'technology',
          language: 'en',
          pageSize: 10, // Get 10 articles
          apiKey: process.env.NEWS_API_KEY
        }
      });
      res.json(response.data.articles); // Send just the articles array
    } catch (error) {
      console.error('News API error:', error.response?.data || error.message);
      res.status(500).json({ 
        message: "Error fetching news", 
        error: "Could not retrieve news at this time." 
      });
    }
  });  

  app.post('/api/products', protect, authorize('seller', 'admin'), async (req, res) => { // Added middleware
    try {
      const { name, description, category, price } = req.body; // Removed sellerId from body
  
      // Basic validation
      if (!name || !description || !category || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newProduct = new Product({
        name,
        description,
        category,
        price,
        sellerId: req.user.id // Use the ID from the authenticated user
      });
  
      const savedProduct = await newProduct.save();
      await savedProduct.populate('sellerId', 'name location email');
      res.status(201).json(savedProduct);
  
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});