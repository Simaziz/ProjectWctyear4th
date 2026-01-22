"use client";

import { useActionState, useState, useEffect } from "react";
import { addCoffee } from "../actions";
import imageCompression from 'browser-image-compression'; // Import the compressor
import { Coffee, DollarSign, Package, UploadCloud, AlertCircle, RefreshCw } from "lucide-react"; 

export default function AddCoffeePage() {
  const [state, formAction, isPending] = useActionState(addCoffee, null);
  const [mounted, setMounted] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // NEW: Function to handle submission and compress image
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCompressing(true);
    
    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get('image') as File;

    if (imageFile && imageFile.size > 0) {
      try {
        const options = {
          maxSizeMB: 1,          // Shrink to under 1MB
          maxWidthOrHeight: 1024, // High enough for quality, small for speed
          useWebWorker: true
        };
        const compressedFile = await imageCompression(imageFile, options);
        formData.set('image', compressedFile); // Replace big image with small one
      } catch (error) {
        console.error("Compression error:", error);
      }
    }

    // Now send the smaller data to your Server Action
    formAction(formData);
    setIsCompressing(false);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-6 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden">
        <div className="bg-stone-900 p-8 text-center">
          <h1 className="text-2xl font-serif italic text-stone-100">Add New Blend</h1>
        </div>

        <div className="p-8">
          {/* Change: Use onSubmit instead of action={formAction} to allow compression */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {state?.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 text-xs font-bold">{state.error}</p>
              </div>
            )}

            <div className="space-y-4">
              <input name="name" placeholder="Name" className="w-full p-4 bg-stone-50 border rounded-2xl" required />
              
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" inputMode="decimal" placeholder="Price" className="w-full p-4 bg-stone-50 border rounded-2xl" required />
                <input name="stock" type="number" inputMode="numeric" placeholder="Stock" className="w-full p-4 bg-stone-50 border rounded-2xl" required />
              </div>

              <div className="space-y-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer bg-stone-50">
                  <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Select Image</span>
                  <input name="image" type="file" accept="image/*" className="hidden" required />
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending || isCompressing}
              className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl disabled:bg-stone-200"
            >
              {(isPending || isCompressing) ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
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