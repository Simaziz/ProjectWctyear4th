'use server';

import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Added prevState as the first argument to satisfy useActionState
export async function addCoffee(prevState: any, formData: FormData) {
  await dbConnect();

  try {
    const file = formData.get('image') as File;
    
    // Basic Validation
    if (!file || file.size === 0) {
      return { error: "Please upload an image." }; // Return object instead of throwing
    }

    // Process Image for Cloudinary
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

    // Save to MongoDB
    await Product.create({
      name: formData.get('name'),
      price: Number(formData.get('price')),
      image: uploadResponse.secure_url,
      stock: Number(formData.get('stock')),
    });

    // Update the UI cache
    revalidatePath('/menu'); 
    revalidatePath('/admin');

  } catch (error) {
    console.error("Upload Error:", error);
    // If the error is a redirect, we must re-throw it (Next.js requirement)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return { error: "Failed to add coffee. Please try again." };
  }

  // 2. Redirect should ideally happen outside the try/catch or be handled specifically
  redirect('/menu');
}