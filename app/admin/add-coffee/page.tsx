"use client"; // useActionState requires a Client Component

import { useActionState } from "react";
import { addCoffee } from "../actions";

export default function AddCoffeePage() {
  // state will contain the { error: string } returned by your action
  // formAction is what you pass to the form
  const [state, formAction, isPending] = useActionState(addCoffee, null);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-brown-900">Add New Coffee</h1>
      
      <form action={formAction} className="flex flex-col gap-4">
        {/* If there is an error message, show it here */}
        {state?.error && (
          <p className="text-red-500 bg-red-50 p-2 rounded border border-red-200 text-sm">
            {state.error}
          </p>
        )}

        <input name="name" placeholder="Coffee Name" className="border p-2 rounded" required />
        <input name="price" type="number" placeholder="Price" className="border p-2 rounded" required />
        <input name="stock" type="number" placeholder="Stock" className="border p-2 rounded" required />
        
        <label className="text-sm font-medium text-gray-700">Coffee Image</label>
        <input name="image" type="file" accept="image/*" className="border p-2 rounded" required />

        <button 
          type="submit" 
          disabled={isPending}
          className="bg-orange-900 text-white py-2 rounded-lg hover:bg-orange-800 disabled:bg-gray-400"
        >
          {isPending ? "Uploading..." : "Upload to Cozy Cup"}
        </button>
      </form>
    </div>
  );
}