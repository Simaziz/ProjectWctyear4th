import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateOrderStatus } from "./actions";
import { Phone, MapPin, Coffee, CheckCircle2, Clock } from "lucide-react"; // Optional icons

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-stone-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="bg-stone-900 text-white p-6 rounded-t-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-stone-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">Live Queue</p>
        </div>
        <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-stone-500 uppercase font-black mb-1 hidden md:block">Active Orders</span>
            <span className="bg-orange-600 px-4 py-1 rounded-lg text-lg font-black shadow-[0_0_20px_rgba(234,88,12,0.3)]">
              {orders.length}
            </span>
        </div>
      </div>
      
      {/* Responsive Container */}
      <div className="bg-white border border-stone-200 rounded-b-2xl overflow-hidden shadow-2xl">
        
        {/* --- DESKTOP VIEW (Visible on md screens and up) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-500 bg-stone-100/50 tracking-widest">Delivery Details</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest">Coffee</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order: any) => (
                <OrderRow key={order._id.toString()} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW (Visible on small screens only) --- */}
        <div className="md:hidden divide-y divide-stone-100">
          {orders.map((order: any) => (
            <div key={order._id.toString()} className={`p-5 space-y-4 ${order.status === "Completed" ? "bg-stone-50" : "bg-white"}`}>
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <div className={`text-sm font-black truncate ${order.status === "Completed" ? "text-stone-400" : "text-stone-900"}`}>
                    {order.userEmail}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">#{order._id.toString().slice(-6)}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-stone-400 uppercase">Item</p>
                  <p className={`text-xs font-bold ${order.status === "Completed" ? "text-stone-400 line-through" : "text-stone-800"}`}>
                    {order.coffeeName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-stone-400 uppercase">Total</p>
                  <p className="text-xs font-black text-orange-700">${order.price}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <Phone size={14} className="text-orange-600" /> {order.phone || "No phone"}
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-500 italic">
                  <MapPin size={14} className="text-stone-400 shrink-0" /> {order.address || "No address"}
                </div>
              </div>

              {order.status !== "Completed" && (
                <form action={updateOrderStatus} className="pt-2">
                  <input type="hidden" name="orderId" value={order._id.toString()} />
                  <button className="w-full bg-stone-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-200">
                    Mark as Done
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Status Badge to keep code clean
function StatusBadge({ status }: { status: string }) {
  if (status === "Completed") {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white shadow-sm">
        <CheckCircle2 size={10} /> Completed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-200">
      <Clock size={10} /> Pending
    </span>
  );
}

// Sub-component for Desktop Table Row
function OrderRow({ order }: { order: any }) {
  return (
    <tr className={`transition-colors ${order.status === "Completed" ? "bg-stone-50/50" : "hover:bg-orange-50/20"}`}>
      <td className="px-6 py-5">
         <div className={`text-sm font-bold ${order.status === "Completed" ? "text-stone-400" : "text-stone-800"}`}>
              {order.userEmail}
         </div>
         <div className="text-[9px] text-stone-400 font-mono mt-1 tracking-tight">ID: ...{order._id.toString().slice(-6)}</div>
      </td>
      
      <td className={`px-6 py-5 border-x border-stone-100 ${order.status === "Completed" ? "opacity-40" : "bg-stone-50/30"}`}>
        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Phone size={14} className="text-stone-400" /> {order.phone || "---"}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 italic flex items-start gap-2">
          <MapPin size={14} className="text-stone-300 shrink-0 mt-0.5" /> {order.address || "---"}
        </div>
      </td>

      <td className="px-6 py-5">
         <div className={`text-sm font-bold capitalize ${order.status === "Completed" ? "text-stone-400 line-through" : "text-stone-800"}`}>
              {order.coffeeName}
         </div>
         <div className="text-xs font-black text-orange-700 tracking-tighter">${order.price}</div>
      </td>

      <td className="px-6 py-5 text-center">
        <div className="flex justify-center">
          <StatusBadge status={order.status} />
        </div>
      </td>

      <td className="px-6 py-5 text-right">
        {order.status !== "Completed" ? (
          <form action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={order._id.toString()} />
            <button className="bg-stone-900 text-white hover:bg-black px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 shadow-md">
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