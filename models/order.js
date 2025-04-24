const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // UUID
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4 // UUID as MongoDB _id
  },
  customerId: { type: String, required: true },
  products: [productSchema],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  status: { type: String, enum: ['completed', 'pending', 'canceled'], required: true }
});


orderSchema.index({ customerId: 1, status: 1 }); // Index for faster queries on customerId and orderDate
orderSchema.index({ orderDate: 1, status: 1 });
orderSchema.index({ status: 1 }); // Index for faster queries on status

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
