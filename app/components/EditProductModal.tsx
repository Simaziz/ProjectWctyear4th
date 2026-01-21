'use client';
import { useState } from 'react';
import { updateCoffee } from '../admin/actions';
import { Pencil, X, Upload } from 'lucide-react';

export default function EditProductModal({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2.5 text-stone-500 hover:bg-stone-100 rounded-xl transition-all">
        <Pencil size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">Edit Drink</h2>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            
            <form action={async (formData) => {
              await updateCoffee(formData);
              setIsOpen(false);
            }} className="space-y-5">
              <input type="hidden" name="id" value={product._id} />
              <input type="hidden" name="existingImage" value={product.image} />

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Drink Name</label>
                <input name="name" defaultValue={product.name} className="w-full bg-stone-50 border-none focus:ring-2 focus:ring-orange-500 rounded-2xl p-4 text-sm font-bold" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full bg-stone-50 border-none focus:ring-2 focus:ring-orange-500 rounded-2xl p-4 text-sm font-bold" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Stock</label>
                  <input name="stock" type="number" defaultValue={product.stock} className="w-full bg-stone-50 border-none focus:ring-2 focus:ring-orange-500 rounded-2xl p-4 text-sm font-bold" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Image Update</label>
                <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl">
                  <img src={product.image} className="w-12 h-12 rounded-lg object-cover" alt="current" />
                  <input name="image" type="file" className="text-xs font-medium text-stone-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}