"use client";

import { motion, Variants } from "framer-motion";
import { updateOrderStatus } from "../../admin/actions"; 
import { Phone, MapPin, Coffee, CheckCircle2, Clock, User } from "lucide-react";

interface OrderClientWrapperProps {
  initialOrders: any[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function OrderClientWrapper({ initialOrders }: OrderClientWrapperProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-5"
    >
      {initialOrders.map((order) => (
        <motion.div key={order._id.toString()} variants={cardVariants}>
          <OrderCard order={order} />
        </motion.div>
      ))}

      {initialOrders.length === 0 && (
        <div className="bg-white rounded-[2.2rem] p-20 text-center border border-dashed border-stone-200">
          <p className="text-stone-400 italic font-serif text-lg">No orders in the queue...</p>
        </div>
      )}
    </motion.div>
  );
}

function OrderCard({ order }: { order: any }) {
  const isDone = order.status?.toLowerCase() === "completed";

  return (
    <div className={`group relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 border ${
      isDone 
      ? "border-stone-100 bg-stone-50/50 opacity-80" 
      : "border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
    }`}>
      
      <div className="flex flex-col gap-6">
        
        {/* Top Row: User + Coffee Info + Action */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Customer Identity */}
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-all">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-stone-900 truncate">{order.userEmail}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-stone-400 font-mono tracking-tighter uppercase">REF-{order._id.toString().slice(-6)}</span>
                <span className="w-1 h-1 bg-stone-200 rounded-full" />
                <div className="flex items-center gap-1 text-[10px] font-bold text-stone-600">
                  <Phone size={10} className="text-orange-600/50" /> {order.phone || "No contact"}
                </div>
              </div>
            </div>
          </div>

          {/* Coffee Product Info */}
          <div className="flex items-center gap-4 flex-1 lg:justify-center">
            <div className="relative p-3 rounded-2xl bg-orange-50 text-orange-700">
              <Coffee size={20} />
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                {order.quantity || 1}
              </span>
            </div>
            <div>
              <p className={`text-sm font-black uppercase tracking-tight ${isDone ? 'text-stone-300' : 'text-stone-800'}`}>
                {order.coffeeName}
              </p>
              <p className="text-[11px] font-bold text-stone-400 mt-0.5">
                Total: <span className="text-stone-900">${order.totalPrice || (order.price * (order.quantity || 1))}</span>
              </p>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex items-center gap-4">
            <StatusBadge status={order.status} />
            {!isDone && (
              <form action={updateOrderStatus}>
                <input type="hidden" name="orderId" value={order._id.toString()} />
                <button className="bg-stone-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">
                  Complete
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row: Expanded Address & Note Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Address Box */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-white rounded-lg border border-stone-100 text-orange-600 shadow-sm">
              <MapPin size={14} />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Shipping Destination</p>
              <p className="text-[12px] font-bold text-stone-700 leading-relaxed italic">
                {order.address || "Counter Pickup / Dine-in"}
              </p>
            </div>
          </div>

          {/* Note Box - Only shows if there is a note */}
          {order.note && (
            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-white rounded-lg border border-orange-100 text-orange-600 shadow-sm">
                <Clock size={14} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-orange-600/60 uppercase tracking-widest mb-1">Customer Request</p>
                <p className="text-[12px] font-bold text-stone-800 leading-relaxed">
                  “{order.note}”
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const isDone = status?.toLowerCase() === "completed";
  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all ${
      isDone ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
    }`}>
      {isDone ? <CheckCircle2 size={14} /> : <Clock size={14} className="animate-pulse" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {isDone ? "Completed" : "Pending"}
      </span>
    </div>
  );
}