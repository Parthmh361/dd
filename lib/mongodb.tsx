import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://parthchoudhari3612:qsefthikp@cluster0.ccucqrl.mongodb.net/?retryWrites=true&w=majority';

const connect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to the database');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'prototype-v1',
    });
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

export default connect;
