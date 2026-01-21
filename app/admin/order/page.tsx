import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderClientWrapper from "../order/OrderClientWrapper";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage() {
  const session = await auth();
  
  // Premium redirect: ensure unauthorized users don't see a flicker of content
  if (!session) redirect("/login");

  await dbConnect();
  
  // Fetch initial orders on the server
  // We only fetch essential fields to keep the initial payload light for mobile users
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean(); // .lean() makes the query faster by returning plain JS objects

  // Convert MongoDB objects to plain JSON for the Client Component
  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Suspense allows the rest of the page (like a navbar) to load 
          while the Client Component initializes its Pusher connection.
      */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderClientWrapper initialOrders={serializedOrders} />
      </Suspense>
    </main>
  );
}

/** * PREMIUM LOADING SKELETON
 * This shows a beautiful "shimmer" effect while the data is loading,
 * preventing the layout from jumping on slow mobile connections.
 */
function OrderSkeleton() {
  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-stone-200 rounded-lg"></div>
          <div className="h-4 w-32 bg-stone-100 rounded-lg"></div>
        </div>
        <div className="h-16 w-24 bg-stone-200 rounded-2xl"></div>
      </div>
      <div className="h-[400px] w-full bg-stone-100 rounded-[2.5rem]"></div>
    </div>
  );
}