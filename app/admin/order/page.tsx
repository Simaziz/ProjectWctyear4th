import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderClientWrapper from "../order/OrderClientWrapper";

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  // Fetch initial orders on the server
  const orders = await Order.find({}).sort({ createdAt: -1 });

  // Convert MongoDB objects to plain JSON for the Client Component
  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return <OrderClientWrapper initialOrders={serializedOrders} />;
}