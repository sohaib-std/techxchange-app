const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Seller = require('./models/Seller');
const Review = require('./models/Review');

dotenv.config(); // Load environment variables

// Sample data
const sellers = [
  {
    name: "TechGuru Ltd.",
    location: "London, UK",
    email: "contact@techguru.co.uk"
  },
  {
    name: "AudioVisual Experts",
    location: "Manchester, UK",
    email: "sales@av-experts.com"
  }
];

const products = [
  {
    name: "Apple MacBook Pro 16\"",
    description: "10-core CPU, 32-core GPU, 32GB Unified Memory, 1TB SSD Storage.",
    category: "Laptops",
    price: 2499.99,
    // sellerId will be added dynamically
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life.",
    category: "Audio",
    price: 328.99,
    // sellerId will be added dynamically
  }
];

const reviews = [
  {
    rating: 5,
    reviewerName: "Jane Doe",
    reviewText: "Incredible performance for video editing. The battery life is outstanding.",
    // productId will be added dynamically
  },
  {
    rating: 4,
    reviewerName: "John Smith",
    reviewText: "The noise cancellation is mind-blowing. Comfortable for long flights.",
    // productId will be added dynamically
  }
];

const seedDatabase = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    // CLEAR EXISTING DATA (Optional - be careful in production!)
    await Product.deleteMany({});
    await Seller.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data.');

    // INSERT SELLERS
    const createdSellers = await Seller.insertMany(sellers);
    console.log('Sellers seeded successfully.');

    // UPDATE PRODUCTS WITH REAL SELLER IDs
    products[0].sellerId = createdSellers[0]._id; // TechGuru sells MacBook
    products[1].sellerId = createdSellers[1]._id; // AV Experts sells Headphones

    // INSERT PRODUCTS
    const createdProducts = await Product.insertMany(products);
    console.log('Products seeded successfully.');

    // UPDATE REVIEWS WITH REAL PRODUCT IDs
    reviews[0].productId = createdProducts[0]._id; // Review for MacBook
    reviews[1].productId = createdProducts[1]._id; // Review for Headphones

    // INSERT REVIEWS
    await Review.insertMany(reviews);
    console.log('Reviews seeded successfully.');

    console.log('Database seeding completed successfully! 🌱');
    process.exit(0); // Exit successfully

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1); // Exit with error
  }
};

// Run the seed function
seedDatabase();