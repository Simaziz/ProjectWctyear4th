import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateOrderStatus } from "./actions";
import { Phone, MapPin, Coffee, CheckCircle2, Clock, User, Hash } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-stone-50 min-h-screen font-sans pb-20">
      
      {/* Header Section */}
      <div className="bg-stone-900 text-white p-6 rounded-t-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-stone-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">Live Queue</p>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="bg-orange-600 px-4 py-1 rounded-lg text-lg font-black shadow-[0_0_20px_rgba(234,88,12,0.3)]">
              {orders.length}
            </span>
        </div>
      </div>
      
      <div className="bg-white border border-stone-200 rounded-b-3xl overflow-hidden shadow-xl">
        
        {/* --- DESKTOP VIEW (Tables work here) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Customer</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-500 bg-stone-100/50">Delivery</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Coffee</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order: any) => (
                <OrderRow key={order._id.toString()} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW (Card-based Layout) --- */}
        <div className="md:hidden divide-y divide-stone-100">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-stone-400 text-sm">No orders yet.</div>
          ) : (
            orders.map((order: any) => (
              <div key={order._id.toString()} className={`p-5 space-y-4 ${order.status === "Completed" ? "bg-stone-50/50" : "bg-white"}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="max-w-[180px]">
                      <div className={`text-sm font-bold truncate ${order.status === "Completed" ? "text-stone-400" : "text-stone-900"}`}>
                        {order.userEmail}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">#{order._id.toString().slice(-6)}</div>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coffee size={16} className="text-orange-600" />
                      <span className={`text-sm font-bold ${order.status === "Completed" ? "text-stone-400 line-through" : "text-stone-900"}`}>
                        {order.coffeeName}
                      </span>
                    </div>
                    <span className="text-sm font-black text-orange-700">${order.price}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-stone-200/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <Phone size={14} className="text-stone-400" /> {order.phone || "No phone"}
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-500 italic">
                      <MapPin size={14} className="text-stone-300 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2">{order.address || "No address provided"}</span>
                    </div>
                  </div>
                </div>

                {order.status !== "Completed" && (
                  <form action={updateOrderStatus}>
                    <input type="hidden" name="orderId" value={order._id.toString()} />
                    <button className="w-full bg-stone-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-stone-200">
                      Mark as Completed
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Status Badge
function StatusBadge({ status }: { status: string }) {
  const isDone = status === "Completed";
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${
      isDone 
      ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" 
      : "bg-amber-50 text-amber-700 border-amber-200"
    }`}>
      {isDone ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {status || "Pending"}
    </span>
  );
}

// Reusable Desktop Row
function OrderRow({ order }: { order: any }) {
  const isDone = order.status === "Completed";
  return (
    <tr className={`transition-colors ${isDone ? "bg-stone-50/50" : "hover:bg-orange-50/20"}`}>
      <td className="px-6 py-5">
         <div className={`text-sm font-bold ${isDone ? "text-stone-400" : "text-stone-800"}`}>
              {order.userEmail}
         </div>
         <div className="text-[9px] text-stone-400 font-mono mt-1 italic tracking-tighter">ID: {order._id.toString()}</div>
      </td>
      
      <td className={`px-6 py-5 border-x border-stone-100 ${isDone ? "opacity-40" : "bg-stone-50/30"}`}>
        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Phone size={14} className="text-stone-400" /> {order.phone || "---"}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 italic flex items-start gap-2 max-w-[200px]">
          <MapPin size={14} className="text-stone-300 shrink-0 mt-0.5" /> {order.address || "---"}
        </div>
      </td>

      <td className="px-6 py-5">
         <div className={`text-sm font-bold capitalize ${isDone ? "text-stone-400 line-through" : "text-stone-800"}`}>
              {order.coffeeName}
         </div>
         <div className="text-xs font-black text-orange-700">${order.price}</div>
      </td>

      <td className="px-6 py-5 text-center">
        <div className="flex justify-center">
          <StatusBadge status={order.status} />
        </div>
      </td>

      <td className="px-6 py-5 text-right">
        {!isDone ? (
          <form action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={order._id.toString()} />
            <button className="bg-stone-900 text-white hover:bg-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 shadow-md">
              Done
            </button>
          </form>
        ) : (
          <span className="text-stone-300 text-[10px] font-bold uppercase italic tracking-widest">Archived</span>
        )}
      </td>
    </tr>
  );
}