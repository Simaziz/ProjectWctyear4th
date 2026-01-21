import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import Image from "next/image";
import OrderButton from "../components/OrderButton";
import MenuAnimations from "../components/MenuAnimations"; // We'll create this below

export default async function MenuPage() {
  await dbConnect();
  const rawCoffees = await Product.find({});
  const coffees = JSON.parse(JSON.stringify(rawCoffees));

  return (
    <div className="min-h-screen bg-[#fcfaf8] pb-20">
      {/* Hero Header Section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="relative text-center z-10 px-4">
          <span className="text-orange-500 uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
            Crafted with Passion
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 italic">
            The Signature Collection
          </h1>
          <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <MenuAnimations> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coffees.map((coffee: any) => (
              <div
                key={coffee._id}
                className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_-10px_rgba(120,60,20,0.15)] border border-stone-100/50"
              >
                {/* Image Container with Custom Aspect Ratio */}
                <div className="relative w-full aspect-[1/1] mb-6 overflow-hidden rounded-[2rem] bg-stone-100">
                  <Image
                    src={coffee.image || "/images/coffee-placeholder.jpg"}
                    alt={coffee.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Glassmorphism Price Tag */}
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-white/70 px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                    <p className="text-orange-950 font-black text-sm">${coffee.price}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-stone-800 tracking-tight group-hover:text-orange-900 transition-colors">
                      {coffee.name}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`h-1.5 w-1.5 rounded-full ${coffee.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <p className="text-[11px] font-black uppercase tracking-widest text-stone-400">
                      {coffee.stock > 0 ? `${coffee.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>

                  {/* Order Button Container */}
                  <div className="relative z-10">
                    <OrderButton coffee={coffee} />
                  </div>
                </div>

                {/* Subtle Decorative Background Element */}
                <div className="absolute -bottom-2 -right-2 text-stone-50 pointer-events-none -z-10 group-hover:text-orange-50 transition-colors">
                   <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="100" fill="currentColor" fillOpacity="0.5"/>
                   </svg>
                </div>
              </div>
            ))}
          </div>
        </MenuAnimations>
      </div>
    </div>
  );
}