"use client";

import { useActionState } from "react";
import { updateCoffee } from "../../actions";
import { Coffee, DollarSign, Package, UploadCloud, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// We pass the initial product data as a prop from the parent or fetch it via a hook
export default function EditCoffeePage({ product }: { product: any }) {
  // useActionState handles the pending state and server response
  const [state, formAction, isPending] = useActionState(updateCoffee, null);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          Back to Inventory
        </Link>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 p-8 text-center">
            <h1 className="text-2xl font-serif italic text-stone-100">Edit Selection</h1>
            <p className="text-stone-400 text-[10px] mt-2 uppercase tracking-widest font-light">
              Refining {product.name}
            </p>
          </div>

          <form action={formAction} noValidate className="p-8 space-y-6">
            {/* Hidden inputs for Server Action */}
            <input type="hidden" name="id" value={product._id} />
            <input type="hidden" name="existingImage" value={product.image} />

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Drink Name</label>
                <div className="relative">
                  <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    defaultValue={product.name}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price Field - Decimal Support */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      inputMode="decimal"
                      defaultValue={product.price}
                      className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none"
                    />
                  </div>
                </div>

                {/* Stock Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Stock Level</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      inputMode="numeric"
                      defaultValue={product.stock}
                      className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Update Imagery</label>
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <img src={product.image} alt="current" className="w-16 h-16 rounded-xl object-cover shadow-sm border border-white" />
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-100 transition-all text-[11px] font-bold uppercase text-stone-600 shadow-sm">
                      <UploadCloud size={16} />
                      Choose New Photo
                      <input name="image" type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-stone-100 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-stone-800 active:scale-[0.98] disabled:bg-stone-300 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {isPending ? (
                <RefreshCw size={18} className="animate-spin text-stone-400" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}