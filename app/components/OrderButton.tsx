"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrderButton({ coffee }: { coffee: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleOrder = async () => {
    if (!session) {
      alert("Please log in to order!");
      router.push("/login");
      return;
    }

    try {
      // We send coffeeId to match what the API expects
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coffeeId: coffee._id, 
          coffeeName: coffee.name,
          price: coffee.price,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`☕ Success! Your ${coffee.name} is on the way.`);
        router.refresh();
      } else {
        // This alert is where you see "Out of stock!"
        alert(data.error); 
      }
    } catch (err) {
      alert("Something went wrong with the network.");
    }
  };

  return (
    <button 
      onClick={handleOrder}
      disabled={coffee.stock <= 0}
      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
        coffee.stock > 0 
          ? "bg-orange-800 hover:bg-orange-900 active:scale-95" 
          : "bg-stone-400 cursor-not-allowed"
      }`}
    >
      {coffee.stock > 0 ? "Order Now" : "Sold Out"}
    </button>
  );
}