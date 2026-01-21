'use server';

import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- EXISTING ADD COFFEE ACTION (NO CHANGES NEEDED) ---
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
          transformation: [{ width: 500, height: 500, crop: 'limit' }] 
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    await Product.create({
      name: formData.get('name'),
      price: Number(formData.get('price')),
      image: uploadResponse.secure_url,
      stock: Number(formData.get('stock')),
    });
    revalidatePath('/menu'); 
    revalidatePath('/admin');
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to add coffee. Please try again." };
  }
  redirect('/menu');
}

// --- FIXED ACTION: UPDATE ORDER STATUS ---
// Added Promise<void> type and removed object returns to satisfy the form action type
export async function updateOrderStatus(formData: FormData): Promise<void> {
  await dbConnect();
  
  const orderId = formData.get("orderId");

  try {
    // Find the order and change status to 'completed'
    await Order.findByIdAndUpdate(orderId, { 
      status: "completed" 
    });
    
    // Refresh the specific path where the orders are listed
    revalidatePath("/admin/order"); 
    
    // We do NOT return { success: true } here anymore.
    // revalidatePath handles the UI update automatically.
  } catch (error) {
    console.error("Failed to update order:", error);
    // If you need to handle errors on the UI, you would use useActionState 
    // but for a simple "Mark as Done" button, leaving it void is best.
  }
}