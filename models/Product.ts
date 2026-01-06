import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String, // Cloudinary URL
  stock: Number,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);