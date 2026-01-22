"use client";

import { useActionState, useEffect } from "react";
import { addCoffee } from "../actions";
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle } from "lucide-react"; 

export default function AddCoffeePage() {
  const [state, formAction, isPending] = useActionState(addCoffee, null);

  // Smooth scroll to top if an error appears - helpful for mobile users
  useEffect(() => {
    if (state?.error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-6 md:py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-stone-900 p-6 md:p-8 text-center">
          <h1 className="text-2xl md:text-3xl font-serif italic text-stone-100">Cozy Cup</h1>
          <p className="text-stone-400 text-[10px] md:text-sm mt-2 uppercase tracking-widest font-light">
            Curate Your Collection
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* noValidate prevents mobile browsers from showing their own incompatible popups */}
          <form action={formAction} noValidate className="space-y-6">
            
            {/* Error Message */}
            {state?.error && (
              <div key={state.error} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm font-medium">{state.error}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <label className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 mb-1 block">
                  Coffee Blend Name
                </label>
                <div className="relative">
                  <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Ethiopian Yirgacheffe" 
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all placeholder:text-stone-300 text-sm md:text-base"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      inputMode="decimal" // Forces decimal keypad on mobile
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all text-sm md:text-base"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Stock</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      inputMode="numeric" // Forces numeric keypad on mobile
                      placeholder="Qty"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all text-sm md:text-base"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Custom File Upload */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Product Imagery</label>
                <div className="relative flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                      <p className="text-xs md:text-sm text-stone-500 px-4 text-center">Tap to upload high-res image</p>
                    </div>
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      required 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-stone-100 py-4 rounded-xl font-medium tracking-wide hover:bg-stone-800 active:scale-[0.98] disabled:bg-stone-300 disabled:scale-100 transition-all shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
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