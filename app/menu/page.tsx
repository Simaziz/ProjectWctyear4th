import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product"; // Make sure this matches your model name
import Image from "next/image";
import OrderButton from "../components/OrderButton"; // Import the client component

export default async function MenuPage() {
  await dbConnect();
  // We stringify the data to pass it from Server to Client safely
  const rawCoffees = await Product.find({});
  const coffees = JSON.parse(JSON.stringify(rawCoffees));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-950">Cozy Cup Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coffees.map((coffee: any) => (
          <div key={coffee._id} className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="relative h-48 w-full mb-4">
              <Image 
                src={coffee.image} 
                alt={coffee.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover rounded-md" 
              />
            </div>
            <h2 className="text-xl font-semibold">{coffee.name}</h2>
            <p className="text-gray-600">${coffee.price}</p>
            <p className="text-sm text-orange-600 font-medium">Stock: {coffee.stock} left</p>
            
            {/* Replace the static button with our interactive Client Component */}
            <div className="mt-4">
              <OrderButton coffee={coffee} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}