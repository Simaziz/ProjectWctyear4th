"use client";

import { useActionState, useState, useEffect } from "react";
import { updateCoffee } from "../../actions";
import imageCompression from 'browser-image-compression'; // Ensure this is installed
import { Coffee, DollarSign, Package, UploadCloud, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditCoffeePage({ product }: { product: any }) {
  const [state, formAction, isPending] = useActionState(updateCoffee, null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCompressing(true);
    
    const formData = new FormData(event.currentTarget);
    const newImage = formData.get('image') as File;

    // Only compress if a new file was actually selected
    if (newImage && newImage.size > 0) {
      try {
        const options = {
          maxSizeMB: 1, 
          maxWidthOrHeight: 1024,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(newImage, options);
        formData.set('image', compressedFile);
      } catch (error) {
        console.error("Compression failed:", error);
      }
    }

    formAction(formData);
    setIsCompressing(false);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 px-4 font-sans">
      <div className="max-w-xl mx-auto">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} />
          Back to Inventory
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 p-8 text-center">
            <h1 className="text-2xl font-serif italic text-stone-100">Edit Selection</h1>
            <p className="text-stone-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-light">
              Modifying {product.name}
            </p>
          </div>

          <form onSubmit={handleEditSubmit} noValidate className="p-8 space-y-6">
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-[11px] font-bold uppercase tracking-tight">{state.error}</p>
              </div>
            )}

            {/* Hidden identifiers */}
            <input type="hidden" name="id" value={product._id} />
            <input type="hidden" name="existingImage" value={product.image} />

            <div className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Drink Name</label>
                <div className="relative">
                  <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    name="name" 
                    defaultValue={product.name}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all text-stone-800 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price Field */}
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
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Stock Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Stock</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      name="stock" 
                      type="number" 
                      inputMode="numeric"
                      defaultValue={product.stock}
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Image Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Update Imagery</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-stone-50 rounded-[2rem] border border-stone-200">
                  <div className="relative group">
                    <img 
                      src={product.image} 
                      alt="current" 
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white" 
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[8px] text-white font-bold uppercase">Current</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <label className="flex flex-col items-center justify-center gap-2 w-full py-6 bg-white border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all">
                      <UploadCloud size={20} className="text-stone-400" />
                      <span className="text-[10px] font-bold uppercase text-stone-500">Tap to Replace Photo</span>
                      <input name="image" type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending || isCompressing}
              className="w-full bg-stone-900 text-stone-100 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {(isPending || isCompressing) ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Updating Catalog...
                </>
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