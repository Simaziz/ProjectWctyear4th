"use client";

import { CheckCircle2, Clock, MapPin, Phone, Coffee, User, Hash } from "lucide-react";
import { updateOrderStatus } from "../admin/actions";

export default function OrderRow({ order }: { order: any }) {
  const isDone = order.status === "completed";

  return (
    <div className={`group relative bg-white rounded-[2rem] p-6 mb-4 transition-all duration-500 border border-stone-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ${isDone ? 'opacity-80' : ''}`}>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Customer & ID */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 border border-stone-100 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
            <User size={20} />
          </div>
          <div>
            <h3 className={`font-bold text-stone-900 ${isDone ? 'line-through text-stone-400' : ''}`}>
              {order.userEmail}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-1">
                <Hash size={10} /> {order._id.toString().slice(-6)}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Coffee & Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-[2]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coffee size={14} className="text-orange-600" />
              <span className="text-sm font-black text-stone-800 uppercase tracking-tight">
                {order.coffeeName}
              </span>
            </div>
            <p className="text-xs font-bold text-orange-700 ml-6">${order.price}</p>
          </div>

          <div className="space-y-1 border-l border-stone-100 pl-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
              <Phone size={12} className="text-stone-300" /> {order.phone || "No contact"}
            </div>
            <div className="flex items-start gap-2 text-[11px] text-stone-400 leading-relaxed">
              <MapPin size={12} className="text-stone-200 shrink-0 mt-0.5" /> 
              <span className="line-clamp-1 italic">{order.address || "Counter Pickup"}</span>
            </div>
          </div>
        </div>

        {/* Right: Status & Action */}
        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-none pt-4 lg:pt-0">
          <StatusBadge status={order.status} />

          {!isDone && (
            <form action={updateOrderStatus}>
              <input type="hidden" name="orderId" value={order._id.toString()} />
              <button className="bg-stone-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-lg active:scale-95 transition-all">
                Complete
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isDone = status === "completed";
  
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all ${
      isDone 
      ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" 
      : "bg-amber-50/50 border-amber-100 text-amber-700"
    }`}>
      {isDone ? (
        <CheckCircle2 size={14} className="animate-in zoom-in duration-500" />
      ) : (
        <Clock size={14} className="animate-pulse" />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {status}
      </span>
    </div>
  );
}