"use client";

import { useActionState, useState, useEffect } from "react";
import { addCoffee } from "../actions";
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle, RefreshCw } from "lucide-react"; 

export default function AddCoffeePage() {
  const [state, formAction, isPending] = useActionState(addCoffee, null);
  const [mounted, setMounted] = useState(false);

  // This prevents the "Application Error" hydration mismatch on mobile
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Wait for client-side mounting

  return (
    <div className="min-h-screen bg-[#faf9f6] py-6 md:py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden">
        
        <div className="bg-stone-900 p-8 text-center">
          <h1 className="text-2xl font-serif italic text-stone-100">Add New Blend</h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em] mt-2">Inventory Management</p>
        </div>

        <div className="p-8">
          {/* noValidate stops mobile browsers from crashing with native popups */}
          <form action={formAction} noValidate className="space-y-6">
            
            {state?.error && (
              <div key={state.error} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-xs font-bold">{state.error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Blend Name</label>
                <div className="relative">
                  <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    autoComplete="off"
                    placeholder="e.g. Midnight Roast" 
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all text-sm"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price Input - CRITICAL FOR MOBILE */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      inputMode="decimal" // This triggers the decimal keyboard on iPhone
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required 
                    />
                  </div>
                </div>

                {/* Stock Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Stock</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      inputMode="numeric"
                      placeholder="Qty"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 rounded-3xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-all">
                  <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Select Image</span>
                  <input name="image" type="file" accept="image/*" className="hidden" required />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-stone-800 active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 transition-all shadow-xl"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add to Inventory"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}