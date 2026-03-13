import Image from "next/image";
import { getProducts } from "@/lib/getProducts";
import ProductScroll from "../app/components/ProductScroll";
import TopDrink from "../app/components/TopDrinks";
import TopDiscount from "../app/components/TopDiscount";
import { Coffee } from "../app/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const coffees: Coffee[] = await getProducts(50);

  console.log("All coffees:", coffees);

  return (
    <div className="flex flex-col">
      {/* Poster */}
      <div className="relative flex-1 pt-70 h-[300px]">
        <Image
          src="/images/Cozycup.png"
          alt="Poster"
          fill
          className="object-cover"
        />
      </div>

      {/* Top Drinks */}
      <TopDrink products={coffees} />

      {/* Top Discount */}
       <div className="grid justify-center "
        style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0800 70%, #0d0400 100%)",
      }}>
        <TopDiscount  products={coffees} />
       </div>
      

      {/* All Menu */}
      <div className="p-6 bg-[#fcfaf8]">
        <h2 className="text-5xl font-bold mb-4 flex justify-center text-orange-500 uppercase">
          Menu
        </h2>
        <ProductScroll products={coffees} />
      </div>
    </div>
  );
}