const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI ;
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = { connectDB };
