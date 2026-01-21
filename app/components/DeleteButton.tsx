'use client';

import { Trash2 } from "lucide-react";
import { deleteCoffee } from "../admin/actions";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async (formData: FormData) => {
    const confirmed = window.confirm("Are you sure you want to delete this drink?");
    if (confirmed) {
      await deleteCoffee(formData);
    }
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}