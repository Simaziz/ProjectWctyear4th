"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { addCoffee } from "../actions";
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AddCoffeePage() {
  const [state, formAction, isPending] = useActionState(addCoffee, null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle Image Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      setPreviewUrl(null);
      formRef.current?.reset();
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#faf9f6] py-6 md:py-12 px-4 flex flex-col items-center">
      
      {/* Success Notification - Responsive Position */}
      {showSuccess && (
        <div className="fixed bottom-6 md:top-6 md:bottom-auto right-4 left-4 md:left-auto md:right-6 flex items-center gap-3 p-4 bg-white border border-emerald-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-5 md:slide-in-from-right-10 duration-500 z-50">
          <div className="bg-emerald-500 p-1 rounded-full shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-stone-900 font-bold text-sm">Upload Successful</p>
            <p className="text-stone-500 text-xs">New blend added to inventory.</p>
          </div>
        </div>
      )}

      <div className="max-w-xl w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-8 md:p-12 text-center">
          <h1 className="text-2xl md:text-3xl font-serif italic text-stone-100">Cozy Cup</h1>
          <p className="text-stone-500 text-[10px] mt-2 uppercase tracking-[0.4em] font-medium">Add to Collection</p>
        </div>

        <div className="p-6 md:p-10">
          <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">
            
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm font-medium">{state.error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Blend Name</label>
                <div className="relative group">
                  <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                  <input 
                    name="name" 
                    placeholder="e.g. Ethiopian Yirgacheffe" 
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all placeholder:text-stone-300 text-stone-800 text-sm md:text-base"
                    required 
                  />
                </div>
              </div>

              {/* Responsive Grid for Price/Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Price</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all text-sm md:text-base"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Stock</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
                    <input 
                      name="stock" 
                      type="number" 
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:bg-white outline-none transition-all text-sm md:text-base"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Responsive Image Upload / Preview */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Product Imagery</label>
                
                {!previewUrl ? (
                  <label className="group relative flex flex-col items-center justify-center w-full h-44 md:h-52 border-2 border-dashed border-stone-200 rounded-[2rem] cursor-pointer bg-stone-50 hover:bg-stone-100 hover:border-stone-400 transition-all overflow-hidden px-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-stone-400 group-hover:text-stone-900 transition-colors" />
                      </div>
                      <p className="text-sm text-stone-600 font-bold">Select high-res image</p>
                      <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-tighter">Maximum file size: 5MB</p>
                    </div>
                    <input name="image" type="file" accept="image/*" className="hidden" required onChange={handleImageChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-44 md:h-52 rounded-[2rem] overflow-hidden border border-stone-200 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setPreviewUrl(null)}
                      className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white p-2 rounded-full hover:bg-stone-900 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-stone-900 text-stone-100 py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs hover:bg-stone-800 active:scale-[0.98] disabled:bg-stone-200 disabled:text-stone-400 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-3 mt-4"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-100 rounded-full animate-spin" />
                  <span>Processing Collection...</span>
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