import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Pusher from "pusher";

// Initialize Pusher for real-time updates to the Admin Dashboard
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  const session = await auth();
  
  // 1. Security Check: Ensure user is logged in
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    
    // 2. Extract data from request with a default quantity of 1
    const { coffeeId, address, phone, note, quantity = 1 } = data;

    // 3. Find product and handle stock deduction
    // We use findOneAndUpdate with a stock check to prevent overselling
    const product = await Product.findOneAndUpdate(
      { _id: coffeeId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or insufficient stock" }, 
        { status: 400 }
      );
    }

    // 4. Calculate Total Price on the server for security
    const calculatedTotal = product.price * quantity;

    // 5. Create the Order in the database with quantity and total price
    const newOrder = await Order.create({
      userEmail: session.user.email,
      productId: product._id, 
      coffeeName: product.name,
      price: product.price,       // Unit Price at time of purchase
      quantity: quantity,         // Number of items ordered
      totalPrice: calculatedTotal, // Calculated final amount
      address: address, 
      phone: phone,     
      note: note || "",
      status: "Pending",
    });

    // 6. TRIGGER REAL-TIME EVENT for Admin Dashboard
    // We send the extra details so the admin sees the update instantly
    await pusher.trigger("admin-orders", "new-order", {
      customer: session.user.email,
      coffee: product.name,
      quantity: quantity,
      total: calculatedTotal.toFixed(2)
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("ORDER CREATION ERROR:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}