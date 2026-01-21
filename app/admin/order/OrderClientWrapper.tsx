"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { updateOrderStatus } from "../actions";
import { Phone, MapPin, Coffee, CheckCircle2, Clock, Bell } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OrderClientWrapper({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("admin-orders");
    channel.bind("new-order", (data: any) => {
      // Premium Toast instead of browser Alert
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-stone-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-orange-500/50`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Bell className="h-10 w-10 text-orange-500 bg-orange-500/10 p-2 rounded-full" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white uppercase tracking-widest">New Order Received</p>
                <p className="mt-1 text-sm text-stone-400">
                  <span className="text-orange-400 font-bold">{data.customer}</span> wants a <span className="text-white">{data.coffee}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-stone-800">
            <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-orange-500 hover:text-orange-400 focus:outline-none">
              View
            </button>
          </div>
        </div>
      ));
      router.refresh();
    });

    return () => {
      pusher.unsubscribe("admin-orders");
    };
  }, [router]);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto bg-[#fafaf9] min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tighter">Active Orders</h1>
          <p className="text-stone-400 text-xs md:text-sm uppercase tracking-[0.3em] mt-2 font-bold italic">Real-time Kitchen Display</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-stone-200 shadow-xl flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block uppercase font-black tracking-widest">Total Queue</span>
            <span className="text-4xl font-black text-orange-600 leading-none">{initialOrders.length}</span>
          </div>
          <div className="h-10 w-[1px] bg-stone-100 hidden md:block" />
          <div className="bg-orange-50 p-2 rounded-full hidden md:block">
            <Coffee className="text-orange-600 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
        
        {/* --- DESKTOP TABLE --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase text-stone-400 tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-white bg-stone-900 tracking-widest">Delivery Details</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-stone-400 tracking-widest">Coffee</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-stone-400 tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase text-stone-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {initialOrders.map((order: any) => (
                <DesktopRow key={order._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARDS --- */}
        <div className="md:hidden divide-y divide-stone-100">
          {initialOrders.map((order: any) => (
            <MobileCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- MOBILE COMPONENT --- */
function MobileCard({ order }: { order: any }) {
  const isCompleted = order.status?.toUpperCase() === "COMPLETED";
  return (
    <div className={`p-6 space-y-4 ${isCompleted ? "bg-stone-50/50 opacity-80" : "bg-white"}`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black font-mono text-stone-400 uppercase">ID: ...{order._id.slice(-6)}</span>
        <StatusBadge status={order.status} />
      </div>
      
      <div>
        <h3 className={`text-base font-bold ${isCompleted ? "text-stone-400" : "text-stone-900"}`}>{order.userEmail}</h3>
        <p className={`text-xl font-black mt-1 ${isCompleted ? "text-stone-300 line-through" : "text-orange-600"}`}>
          {order.coffeeName}
        </p>
      </div>

      <div className="bg-stone-50 rounded-2xl p-4 space-y-2 border border-stone-100">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-700">
          <Phone size={14} className="text-orange-600" /> {order.phone || "No Phone"}
        </div>
        <div className="flex items-start gap-2 text-xs text-stone-500 italic leading-relaxed">
          <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" /> {order.address || "No Address"}
        </div>
      </div>

      {!isCompleted && (
        <form action={updateOrderStatus}>
          <input type="hidden" name="orderId" value={order._id} />
          <button className="w-full bg-stone-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-200">
            Confirm Pickup
          </button>
        </form>
      )}
    </div>
  );
}

/* --- DESKTOP ROW COMPONENT --- */
function DesktopRow({ order }: { order: any }) {
  const isCompleted = order.status?.toUpperCase() === "COMPLETED";
  return (
    <tr className={`transition-colors ${isCompleted ? "bg-stone-50/50" : "hover:bg-orange-50/10"}`}>
      <td className={`px-8 py-7 text-sm font-bold ${isCompleted ? "text-stone-300" : "text-stone-800"}`}>
        {order.userEmail}
        <div className="text-[9px] font-mono text-stone-400 font-normal mt-1">#...{order._id.slice(-6)}</div>
      </td>
      
      <td className={`px-8 py-7 border-x border-stone-100/50 ${isCompleted ? "opacity-30" : "bg-stone-50/50"}`}>
        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
           <Phone size={14} className="text-orange-600" /> {order.phone || "---"}
        </div>
        <div className="text-[11px] text-stone-500 italic mt-1.5 flex items-start gap-2">
           <MapPin size={14} className="text-stone-300 shrink-0 mt-0.5" /> {order.address || "---"}
        </div>
      </td>
      
      <td className={`px-8 py-7 font-black text-sm uppercase tracking-tight ${isCompleted ? "text-stone-300 line-through" : "text-stone-900"}`}>
        {order.coffeeName}
      </td>

      <td className="px-8 py-7 text-center">
        <div className="flex justify-center">
            <StatusBadge status={order.status} />
        </div>
      </td>

      <td className="px-8 py-7 text-right">
        {!isCompleted ? (
          <form action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={order._id} />
            <button className="bg-stone-900 text-stone-100 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-md">
              Done
            </button>
          </form>
        ) : (
          <CheckCircle2 className="ml-auto text-stone-200 w-5 h-5" />
        )}
      </td>
    </tr>
  );
}

/* --- STATUS BADGE COMPONENT --- */
function StatusBadge({ status }: { status: string }) {
  const isCompleted = status?.toUpperCase() === "COMPLETED";
  if (isCompleted) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white shadow-sm border border-emerald-600">
        <CheckCircle2 size={10} /> Finished
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
      <Clock size={10} className="animate-pulse" /> Pending
    </span>
  );
}