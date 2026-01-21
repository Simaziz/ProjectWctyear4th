"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Add for premium feel
import { MapPin, Phone, MessageSquare, Loader2, X } from "lucide-react";

export default function OrderButton({ coffee }: { coffee: any }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    note: ""
  });

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported");
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Immediate visual feedback
        setFormData((prev) => ({ ...prev, address: `📍 Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` }));
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addressString = data.display_name || `Lat: ${latitude}, Lon: ${longitude}`;
          setFormData((prev) => ({ ...prev, address: addressString }));
          toast.success("Address found!");
        } catch (err) {
          toast.error("Address found, but details couldn't be loaded.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        toast.error("Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Brewing your order...");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          coffeeId: coffee._id,
          address: formData.address,
          phone: formData.phone,
          note: formData.note
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Order confirmed!", { id: loadingToast });
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to place order.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        disabled={coffee.stock <= 0}
        className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 transition-all shadow-lg shadow-orange-200 cursor-pointer"
      >
        {coffee.stock <= 0 ? "Out of Stock" : "Order Now"}
      </button>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 shadow-2xl relative z-10 border-t md:border border-stone-100"
            >
              {/* Close Handle (Mobile) */}
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6 md:hidden" />
              
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-black text-stone-900 tracking-tight">Delivery</h2>
              <p className="text-stone-500 text-sm mb-8 mt-1">Confirm your details for the {coffee.name}</p>
              
              <form onSubmit={handleOrder} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-2">
                    <Phone size={12} className="text-orange-600" /> Phone Number
                  </label>
                  <input 
                    required
                    type="tel" 
                    placeholder="012 345 678"
                    className="w-full bg-stone-50 border-stone-200 border rounded-2xl p-4 text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-bold" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-orange-600" /> Delivery Address
                    </label>
                    <button 
                      type="button"
                      onClick={fetchCurrentLocation}
                      className="text-[10px] font-black text-orange-600 hover:text-orange-700 underline tracking-tighter"
                    >
                      {locating ? "Locating..." : "📍 USE GPS"}
                    </button>
                  </div>
                  <textarea 
                    required
                    value={formData.address}
                    placeholder="Street, Building, Apartment..."
                    className="w-full bg-stone-50 border-stone-200 border rounded-2xl p-4 text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all h-24 resize-none text-sm font-medium leading-relaxed" 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4 pb-4 md:pb-0">
                  <button 
                    disabled={loading || locating}
                    className="flex-[2] py-4 bg-stone-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Place Order"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}