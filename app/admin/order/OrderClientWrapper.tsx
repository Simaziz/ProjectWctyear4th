"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { updateOrderStatus } from "../actions";

export default function OrderClientWrapper({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("admin-orders");
    channel.bind("new-order", (data: any) => {
      alert(`🔔 NEW ORDER: ${data.customer} wants ${data.coffee}!`);
      router.refresh();
    });

    return () => {
      pusher.unsubscribe("admin-orders");
    };
  }, [router]);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto bg-[#fafaf9] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">Active Orders</h1>
        <div className="bg-white px-6 py-3 rounded-2xl border border-stone-200 shadow-sm text-center">
          <span className="text-sm text-stone-400 block uppercase font-bold">Total Queue</span>
          <span className="text-3xl font-black text-orange-600">{initialOrders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-5 text-[11px] font-black uppercase text-stone-400">Customer</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-white bg-orange-600">Delivery Details</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-stone-400">Coffee</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-stone-400 text-center">Status</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-stone-50">
  {initialOrders.map((order: any) => {
    // We check the status in Uppercase to avoid matching errors
    const isCompleted = order.status?.toUpperCase() === "COMPLETED";

    return (
      <tr key={order._id} className={`transition-colors ${isCompleted ? "bg-stone-50/50" : "hover:bg-orange-50/20"}`}>
        <td className={`px-6 py-6 text-sm font-medium ${isCompleted ? "text-stone-400" : "text-stone-600"}`}>
          {order.userEmail}
        </td>
        
        <td className={`px-6 py-6 border-x border-stone-100/50 ${isCompleted ? "opacity-50" : "bg-orange-50/40"}`}>
          <div className="font-bold text-stone-900">📞 {order.phone || "---"}</div>
          <div className="text-xs text-stone-500 italic mt-1">📍 {order.address || "---"}</div>
        </td>
        
        <td className={`px-6 py-6 font-bold ${isCompleted ? "text-stone-400" : "text-stone-800"}`}>
          {order.coffeeName}
        </td>

        <td className="px-6 py-6 text-center">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${
            isCompleted 
              ? "bg-emerald-500 text-white border-emerald-600" // BRIGHT GREEN
              : "bg-amber-100 text-amber-700 border-amber-200" // AMBER YELLOW
          }`}>
            {order.status || "Pending"}
          </span>
        </td>

        <td className="px-6 py-6 text-right">
          {!isCompleted ? (
            <form action={updateOrderStatus}>
              <input type="hidden" name="orderId" value={order._id} />
              <button className="bg-stone-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-md">
                Done
              </button>
            </form>
          ) : (
            <span className="text-stone-300 text-[10px] font-bold uppercase italic mr-4">Completed</span>
          )}
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}