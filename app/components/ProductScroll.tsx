"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import OrderButton from "./OrderButton";

export default function ProductScroll({ products }: any) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 pb-4">
        {products.map((coffee: any) => (
          <div
            key={coffee._id}
            className="min-w-[220px] bg-white rounded-3xl p-4 shadow-md border-orange-500 border"
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-stone-100">
              <Image
                src={coffee.image || "/images/coffee-placeholder.jpg"}
                alt={coffee.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="font-bold text-stone-800">
              {coffee.name}
            </h3>
            <p className="text-orange-900 font-semibold">
              ${coffee.price}
            </p>
            {/* Order Button Container */}
                             <div className="w-25 z-10">
                               <OrderButton coffee={coffee} />
                             </div>
          </div>
          
        ))}
      </div>

      {/* Orders Button */}
      <div className="mt-4">
     
      </div>
    </div>
  );
}