import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderClientWrapper from "../admin/order/OrderClientWrapper";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  
  // We fetch the orders and convert them to plain objects so the Client Component can read them
  const rawOrders = await Order.find({}).sort({ createdAt: -1 }).lean();
  
  // Ensure the _id is a string so it doesn't cause hydration errors
  const orders = JSON.parse(JSON.stringify(rawOrders));

  return (
    <main className="min-h-screen bg-[#fdfcfb] pb-20 font-sans">
      {/* --- PREMIUM DASHBOARD HEADER --- */}
      <div className="bg-[#1c1917] pt-16 pb-32 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" />
              <span className="text-orange-500 uppercase tracking-[0.4em] text-[10px] font-black">
                Live Operations
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-white italic tracking-tight">
              Order Dispatch
            </h1>
          </div>

          {/* Stats Widget */}
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="text-center">
              <p className="text-stone-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-white/50">Queue</p>
              <p className="text-3xl font-serif text-white italic">{orders.length}</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-stone-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-white/50">Revenue</p>
              <p className="text-xl font-black text-emerald-400">
                ${orders.reduce((acc: number, curr: any) => acc + (curr.totalPrice || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ORDERS LIST AREA --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {/* WE CALL THE WRAPPER HERE. 
            This wrapper contains the fixed OrderCard that shows quantity and total price.
        */}
        <OrderClientWrapper initialOrders={orders} />
      </div>
    </main>
  );
}