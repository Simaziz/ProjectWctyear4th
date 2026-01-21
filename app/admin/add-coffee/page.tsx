"use client";

import { useActionState } from "react";
import { addCoffee } from "../actions";
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle } from "lucide-react"; // Optional icons

export default function AddCoffeePage() {
  const [state, formAction, isPending] = useActionState(addCoffee, null);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-stone-900 p-8 text-center">
          <h1 className="text-3xl font-serif italic text-stone-100">Cozy Cup</h1>
          <p className="text-stone-400 text-sm mt-2 uppercase tracking-widest font-light">
            Curate Your Collection
          </p>
        </div>

        <div className="p-8">
          <form action={formAction} className="space-y-6">
            
            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 text-sm font-medium">{state.error}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 mb-1 block">
                  Coffee Blend Name
                </label>
                <div className="relative">
                  <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    placeholder="e.g. Ethiopian Yirgacheffe" 
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all placeholder:text-stone-300"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="price" 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Stock Count</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      placeholder="Quantity"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Custom File Upload */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1 block">Product Imagery</label>
                <div className="relative flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                      <p className="text-sm text-stone-500">Click to upload high-res image</p>
                    </div>
                    <input name="image" type="file" accept="image/*" className="hidden" required />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-stone-100 py-4 rounded-xl font-medium tracking-wide hover:bg-stone-800 active:scale-[0.98] disabled:bg-stone-300 disabled:scale-100 transition-all shadow-md flex items-center justify-center gap-2"
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