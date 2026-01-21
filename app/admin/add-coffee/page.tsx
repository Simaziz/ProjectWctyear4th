"use client";

import { useActionState, useEffect, useState } from "react";
import { addCoffee } from "../actions";
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AddCoffeePage() {
  // state is returned from your Server Action
  const [state, formAction, isPending] = useActionState(addCoffee, null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Trigger success notification when the server action returns a success flag
  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000); // Hide after 5s
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 flex flex-col items-center">
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-6 right-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xl animate-in slide-in-from-right-10 duration-500 z-50">
          <div className="bg-emerald-500 p-1 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-emerald-900 font-bold text-sm">Upload Successful</p>
            <p className="text-emerald-700 text-xs">The new blend is now in your menu.</p>
          </div>
        </div>
      )}

      <div className="max-w-xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden">
        <div className="bg-stone-900 p-10 text-center">
          <h1 className="text-3xl font-serif italic text-stone-100 italic">Cozy Cup</h1>
          <p className="text-stone-400 text-xs mt-2 uppercase tracking-[0.3em] font-light">Inventory Management</p>
        </div>

        <div className="p-10">
          <form action={formAction} className="space-y-8">
            
            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 text-sm font-medium">{state.error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Coffee Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Blend Name</label>
                <div className="relative">
                  <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    placeholder="e.g. Midnight Roast" 
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all placeholder:text-stone-300 text-stone-800"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Price - Now allowing Decimals */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" // This allows decimals (e.g., 4.99)
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all text-stone-800"
                      required 
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Quantity</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all text-stone-800"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Product Image</label>
                <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-200 rounded-3xl cursor-pointer bg-stone-50 hover:bg-stone-100 hover:border-stone-400 transition-all overflow-hidden">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 text-stone-300 group-hover:text-stone-500 mb-3 transition-colors" />
                    <p className="text-sm text-stone-500 font-medium">Click to select high-res photo</p>
                    <p className="text-[10px] text-stone-400 mt-1 uppercase">JPG, PNG, WEBP</p>
                  </div>
                  <input name="image" type="file" accept="image/*" className="hidden" required />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-stone-100 py-5 rounded-2xl font-bold tracking-widest uppercase text-xs hover:bg-stone-800 active:scale-[0.99] disabled:bg-stone-200 disabled:text-stone-400 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-100 rounded-full animate-spin" />
                  <span>Uploading to Vault...</span>
                </>
              ) : (
                "Publish New Blend"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}