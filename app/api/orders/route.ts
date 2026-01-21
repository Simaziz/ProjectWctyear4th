import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product"; 
import Order from "@/models/Order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Pusher from "pusher";

// Initialize Pusher for server-side triggering
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const { coffeeId, address, phone, note } = data;

    const product = await Product.findOneAndUpdate(
      { _id: coffeeId, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found or out of stock" }, { status: 404 });
    }

    const newOrder = await Order.create({
      userEmail: session.user.email,
      productId: product._id, 
      coffeeName: product.name,
      price: product.price,
      address: address, 
      phone: phone,     
      note: note,
      status: "Pending",
    });

    // TRIGGER REAL-TIME EVENT
    await pusher.trigger("admin-orders", "new-order", {
      customer: session.user.email,
      coffee: product.name
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("SAVE ERROR:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}