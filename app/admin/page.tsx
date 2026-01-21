import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateOrderStatus } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-7xl mx-auto bg-stone-50 min-h-screen font-sans">
      <div className="bg-stone-900 text-white p-6 rounded-t-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-stone-400 text-xs">Manage your coffee queue</p>
        </div>
        <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase font-black block mb-1">Total Orders</span>
            <span className="bg-orange-600 px-4 py-1 rounded-lg text-lg font-black">
              {orders.length}
            </span>
        </div>
      </div>
      
      <div className="bg-white border border-stone-200 rounded-b-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase text-white bg-orange-600 tracking-widest">Delivery Details</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest">Coffee</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order: any) => (
              <tr key={order._id.toString()} className={`transition-colors ${order.status === "Completed" ? "bg-stone-50/50" : "hover:bg-orange-50/30"}`}>
                <td className="px-6 py-5">
                   <div className={`text-sm font-bold ${order.status === "Completed" ? "text-stone-400" : "text-stone-800"}`}>
                        {order.userEmail}
                   </div>
                   <div className="text-[9px] text-stone-400 font-mono mt-1">ID: ...{order._id.toString().slice(-6)}</div>
                </td>
                
                <td className={`px-6 py-5 border-x border-stone-100 ${order.status === "Completed" ? "opacity-50" : "bg-orange-50/10"}`}>
                  <div className="font-bold text-stone-900 text-sm">📞 {order.phone || "---"}</div>
                  <div className="text-xs text-stone-500 mt-1 italic">📍 {order.address || "---"}</div>
                </td>

                <td className="px-6 py-5">
                   <div className={`text-sm font-bold capitalize ${order.status === "Completed" ? "text-stone-400 line-through" : "text-stone-800"}`}>
                        {order.coffeeName}
                   </div>
                   <div className="text-xs font-black text-orange-700">${order.price}</div>
                </td>

                {/* FIXED DYNAMIC STATUS COLORS */}
                <td className="px-6 py-5 text-center">
                  {order.status === "Completed" ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-sm border border-emerald-600">
                      Completed
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-200">
                      Pending
                    </span>
                  )}
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
                    <span className="text-stone-300 text-[10px] font-bold uppercase italic">Ready</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}