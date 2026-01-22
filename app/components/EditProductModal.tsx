"use client";

import { useState, useActionState, useEffect } from "react";
import { updateCoffee } from "../admin/actions";
import { Edit2, RefreshCw, X } from "lucide-react";

export default function EditProductModal({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Hook for premium feedback
  // This matches the (prevState, formData) signature
  const [state, formAction, isPending] = useActionState(updateCoffee, null);

  // 2. Automatically close modal when update is successful
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
      >
        <Edit2 size={18} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-800">Edit Drink</h2>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>

        {/* 3. Use the formAction from the hook */}
        <form action={formAction} className="p-6 space-y-4">
          <input type="hidden" name="id" value={product._id} />
          <input type="hidden" name="existingImage" value={product.image} />

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-stone-400 ml-1">Name</label>
            <input 
              name="name" 
              defaultValue={product.name} 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-stone-400 ml-1">Price</label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                inputMode="decimal"
                defaultValue={product.price} 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-stone-400 ml-1">Stock</label>
              <input 
                name="stock" 
                type="number" 
                inputMode="numeric"
                defaultValue={product.stock} 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-stone-800 disabled:bg-stone-300 transition-all mt-4"
          >
            {isPending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}