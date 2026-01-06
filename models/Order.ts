import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  userEmail: { type: String, required: true },
  coffeeName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Preparing, Completed
  createdAt: { type: Date, default: Date.now },
});

export default models.Order || model("Order", OrderSchema);