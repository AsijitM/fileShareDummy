require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
  // Database connection 🥳
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, connectionParams);
    console.log('Database connected succesfully');
  } catch (error) {
    console.log(error);
    console.log('Database connection failed');
  }
}

module.exports = connectDB;
