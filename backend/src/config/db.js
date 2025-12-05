const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('🔁 Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`⚠️ MongoDB Runtime Error: ${err.message}`);
});

module.exports = { connectDB };
