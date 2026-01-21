import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  userEmail: { type: String, required: true },
  coffeeName: { type: String, required: true },
  price: { type: Number, required: true }, 
  
  // --- ADD THESE TWO LINES ---
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  note: { type: String, default: "" },
  status: { type: String, default: 'Pending' },
}, { 
  timestamps: true 
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;