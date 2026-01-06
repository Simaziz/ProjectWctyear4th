import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product"; 
import Order from "@/models/Order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { coffeeId, coffeeName, price } = await req.json();
    

    // --- DEBUGGING LOGS ---
    console.log("--- New Order Attempt ---");
    console.log("ID received from frontend:", coffeeId);
     
    // 1. Find by ID
    const product = await Product.findById(coffeeId);

    if (!product) {
      console.log("❌ DB Result: Product not found for this ID");
      return NextResponse.json({ error: "Product not found in DB" }, { status: 404 });
    }

    console.log("✅ DB Result: Found product:", product.name);
    console.log("📊 DB Stock Level:", product.stock);

    // 2. Check Stock
    if (product.stock <= 0) {
      return NextResponse.json({ error: "Out of stock!" }, { status: 400 });
    }

    // 3. Process Order
    await Order.create({
      userEmail: session.user?.email,
      coffeeName,
      price,
    });

    product.stock -= 1;
    await product.save();

    return NextResponse.json({ message: "Success" }, { status: 201 });

  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}