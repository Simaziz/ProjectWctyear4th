'use server';

import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- ADD COFFEE ACTION ---
export async function addCoffee(prevState: any, formData: FormData) {
  await dbConnect();
  try {
    const file = formData.get('image') as File;
    if (!file || file.size === 0) {
      return { error: "Please upload an image." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'cozy-cup',
          transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'center' }] 
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // parseFloat ensures decimal support (e.g., 4.50)
    const rawPrice = parseFloat(formData.get('price') as string);
    const formattedPrice = Math.round(rawPrice * 100) / 100; // Rounds to 2 decimal places

    await Product.create({
      name: formData.get('name'),
      price: formattedPrice,
      image: uploadResponse.secure_url,
      stock: Number(formData.get('stock')),
    });

    revalidatePath('/menu'); 
    revalidatePath('/admin');
    revalidatePath('/admin/products');
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to add coffee. Please try again." };
  }
  redirect('/admin/products');
}

// --- DELETE COFFEE ACTION ---
export async function deleteCoffee(formData: FormData): Promise<void> {
  await dbConnect();
  const id = formData.get('id');

  try {
    await Product.findByIdAndDelete(id);
    
    revalidatePath('/menu');
    revalidatePath('/admin/products');
    revalidatePath('/admin');
  } catch (error) {
    console.error("Delete Error:", error);
  }
}

// --- UPDATE COFFEE ACTION ---
export async function updateCoffee(formData: FormData): Promise<void> {
  await dbConnect();
  
  const id = formData.get('id');
  const name = formData.get('name');
  
  // parseFloat ensures decimal support for updates
  const rawPrice = parseFloat(formData.get('price') as string);
  const formattedPrice = Math.round(rawPrice * 100) / 100; 
  
  const stock = Number(formData.get('stock'));
  const file = formData.get('image') as File;

  let imageUrl = formData.get('existingImage') as string;

  try {
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'cozy-cup', transformation: [{ width: 600, height: 600, crop: 'fill' }] },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    await Product.findByIdAndUpdate(id, {
      name,
      price: formattedPrice,
      stock,
      image: imageUrl,
    });

    revalidatePath('/menu');
    revalidatePath('/admin/products');
    revalidatePath('/admin');
  } catch (error) {
    console.error("Update Error:", error);
  }
  redirect('/admin/products');
}

// --- UPDATE ORDER STATUS ---
export async function updateOrderStatus(formData: FormData): Promise<void> {
  const orderId = formData.get("orderId");
  const newStatus = formData.get("status") || "completed";

  if (!orderId) return;

  try {
    await dbConnect();
    
    await Order.findByIdAndUpdate(orderId, { 
      status: newStatus 
    });

    revalidatePath("/admin/order"); 
    revalidatePath("/admin"); 
    revalidatePath("/order");       
    
  } catch (error) {
    console.error("Failed to update order:", error);
    throw new Error("Update failed.");
  }
}