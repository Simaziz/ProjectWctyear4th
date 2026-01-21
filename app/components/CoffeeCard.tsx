"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { Coffee, Loader2, AlertCircle } from "lucide-react";

export default function OrderButton({ coffee }: { coffee: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    // 1. Auth Check - Premium Redirect
    if (!session) {
      toast("Please log in to order", {
        icon: '👤',
        style: { borderRadius: '15px', background: '#1c1917', color: '#fff' }
      });
      router.push("/login");
      return;
    }

    // 2. Out of Stock Check
    if (coffee.stock <= 0) {
      toast.error("Sorry, this blend is out of stock!");
      return;
    }

    setIsOrdering(true);
    const orderToast = toast.loading(`Preparing your ${coffee.name}...`);

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
        toast.success(`Order placed! See you soon.`, { id: orderToast });
        router.refresh(); 
      } else {
        const data = await res.json();
        toast.error(data.error || "Order failed", { id: orderToast });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: orderToast });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      
      <button 
        onClick={handleOrder}
        disabled={isOrdering || coffee.stock <= 0}
        className={`
          relative w-full md:w-auto px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]
          transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 shadow-lg
          ${coffee.stock <= 0 
            ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none" 
            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200"
          }
        `}
      >
        {isOrdering ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : coffee.stock <= 0 ? (
          "Out of Stock"
        ) : (
          <>
            <Coffee className="w-4 h-4" />
            <span>Order Now</span>
          </>
        )}
      </button>
    </>
  );
}