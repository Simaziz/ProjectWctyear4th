"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrderButton({ coffee }: { coffee: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleOrder = async () => {
    // If not logged in, send to login page
    if (!session) {
      alert("Please log in to order your coffee!");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coffeeId: coffee._id,
          coffeeName: coffee.name,
          price: coffee.price,
        }),
      });

      if (res.ok) {
        alert(`☕ ${coffee.name} ordered successfully!`);
        router.refresh(); // This updates the stock count on the screen
      } else {
        const data = await res.json();
        alert(data.error || "Order failed");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <button 
      onClick={handleOrder}
      className="bg-orange-800 text-white px-6 py-2 rounded-full hover:bg-orange-900 transition font-bold"
    >
      Order Now
    </button>
  );
}