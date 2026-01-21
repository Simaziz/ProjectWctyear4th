"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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
      return toast.error("Geolocation is not supported by your browser");
    }

    setLocating(true);
    
    // 1. Get coordinates from the hardware (this is usually fast)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // 2. IMMEDIATE FEEDBACK: Put coordinates in the box so the user isn't waiting
        const tempAddress = `Location Found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setFormData((prev) => ({ ...prev, address: tempAddress }));
        
        try {
          // 3. BACKGROUND FETCH: Get the pretty address string
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } } // Ensure English results
          );
          const data = await res.json();
          
          if (data.display_name) {
            // Smoothly replace the coordinates with the real address
            setFormData((prev) => ({ ...prev, address: data.display_name }));
            toast.success("Address refined!");
          }
        } catch (err) {
          // If the address fetch fails, we still have the coordinates, so it's fine!
          console.error("Reverse geocoding failed", err);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === 1) toast.error("Please enable location permissions.");
        else toast.error("Location timed out.");
      },
      { enableHighAccuracy: true, timeout: 5000 } // Added timeout to prevent infinite loading
    );
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Confirming your order...");

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

      toast.success("Order placed! We will call you soon.", { id: loadingToast });
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
        // Force text-white and solid bg-orange
        className="w-full py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:bg-gray-300 transition-colors cursor-pointer"
      >
        {coffee.stock <= 0 ? "Out of Stock" : "Order Now"}
      </button>

      {showForm && (
        // Removed backdrop-blur-sm to prevent text rendering issues
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          {/* Force bg-white and text-stone-900 to ensure visibility in dark mode */}
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-black text-stone-900 mb-2">Delivery Details</h2>
            <p className="text-stone-600 text-sm mb-6 font-medium">Where should we bring your {coffee.name}?</p>
            
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  placeholder="e.g. 012345678"
                  // Explicitly set text-black and bg-white
                  className="w-full border-stone-200 border-2 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-black bg-white" 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-bold uppercase text-stone-500">Delivery Address</label>
                  <button 
                    type="button"
                    onClick={fetchCurrentLocation}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    {locating ? "Locating..." : "📍 Use Current Location"}
                  </button>
                </div>
                <textarea 
                  required
                  value={formData.address}
                  placeholder="Street name, Building, Room number..."
                  // Explicitly set text-black and bg-white
                  className="w-full border-stone-200 border-2 p-3 rounded-xl focus:border-orange-500 outline-none transition-all h-24 resize-none text-black bg-white" 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={loading || locating}
                  className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black shadow-lg hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Ordering..." : "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}