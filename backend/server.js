const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database'); // Import DB connection

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
    const productReviews = await Review.find({ productId: req.params.id });
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
app.post('/api/reviews', async (req, res) => {
    try {
      const { productId, rating, reviewerName, reviewText } = req.body;
  
      // Basic validation
      if (!productId || !rating || !reviewerName || !reviewText) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newReview = new Review({
        productId,
        rating,
        reviewerName,
        reviewText
      });
  
      const savedReview = await newReview.save();
      res.status(201).json(savedReview); // 201 status for "Created"
  
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});