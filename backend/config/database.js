import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB() {
  try {
    // Connect to MongoDB using connection string from .env
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit if can't connect to database
  }
}