const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const customerSchema = new mongoose.Schema({
  _id: {
    type: String,  // UUID
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  age: {
    type: Number,
    min: 0
  },
  location: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
