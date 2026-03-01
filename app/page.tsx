import Image from "next/image";
import ProductScroll from "../app/components/ProductScroll";
import { getProducts } from "@/lib/getProducts";

export default async function HomePage() {
  const coffees = await getProducts(10); // limit optional

  return (
    <div className="h-screen overflow-hidden flex flex-col  ">
      
      {/* Poster */}
      <div className="relative flex-1 pt-70">
        <Image
          src="/images/Cozycup.png"
          alt="Poster"
          fill
          className="object-cover"
        />
      </div>

      {/* Horizontal products */}
      <div className="p-6 bg-[#fcfaf8] 
">
        <h2 className="text-5xl font-bold  mb-4 flex  justify-center text-orange-500 uppercase   ">
          Top Drinks
        </h2>
        <ProductScroll products={coffees} />
      </div>
    </div>
  );
}