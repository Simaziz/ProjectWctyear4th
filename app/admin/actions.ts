'use server';

import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order'; // Ensure Order model is imported
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success?: boolean;
  error?: string | null;
};

// --- ADD COFFEE ACTION ---
export async function addCoffee(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  await dbConnect();
  try {
    // ... your existing logic ...
    revalidatePath('/menu'); 
    revalidatePath('/admin');
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to add coffee." };
  }
}

// --- UPDATE ORDER STATUS ACTION ---
// MAKE SURE THIS HAS THE 'export' KEYWORD
export async function updateOrderStatus(formData: FormData): Promise<void> {
  await dbConnect();
  const orderId = formData.get("orderId");
  try {
    await Order.findByIdAndUpdate(orderId, { status: "completed" });
    revalidatePath("/admin/order"); 
  } catch (error) {
    console.error("Failed to update order:", error);
  }
}