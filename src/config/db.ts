import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    await mongoose.connect(uri);
    console.log('MongoDB Connected...:', uri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process on error
  }
};

export default connectDB;


