'use client';

import { useState, useTransition } from "react";
import { Trash2, Loader2, X, Check } from "lucide-react";
import { deleteCoffee } from "../admin/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    // Create the FormData object manually since we're using a transition handler
    const formData = new FormData();
    formData.append("id", productId);

    startTransition(async () => {
      try {
        await deleteCoffee(formData);
        setIsConfirming(false);
      } catch (error) {
        console.error("Failed to delete coffee:", error);
        setIsConfirming(false);
      }
    });
  };

  return (
    <div className="flex items-center justify-end min-w-[140px]">
      <AnimatePresence mode="wait">
        {!isConfirming ? (
          /* --- STATE 1: Standard Delete Icon --- */
          <motion.button
            key="delete-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsConfirming(true)}
            className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Delete product"
          >
            <Trash2 size={18} />
          </motion.button>
        ) : (
          /* --- STATE 2: Premium Confirmation Bar --- */
          <motion.div
            key="confirm-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 bg-red-50 p-1 rounded-xl border border-red-100"
          >
            <span className="text-[10px] font-black uppercase tracking-tighter text-red-600 px-2">
              Sure?
            </span>
            
            {/* Cancel Button */}
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isPending}
              className="p-1.5 bg-white text-stone-400 hover:text-stone-600 rounded-lg shadow-sm border border-stone-100 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Confirm Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <Check size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase">Delete</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}