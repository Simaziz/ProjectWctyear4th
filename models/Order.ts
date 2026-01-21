import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  userEmail: String,
  coffeeName: String,
  price: Number,
  // ADD THESE FIELDS HERE
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  note: { type: String, default: "" },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { 
  strict: true // This ensures only these fields are saved
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;