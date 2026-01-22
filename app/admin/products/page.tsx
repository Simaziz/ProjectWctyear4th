import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Coffee, Plus, Package, ArrowLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import EditProductModal from "../../components/EditProductModal";
import DeleteProductButton from "../../components/DeleteProductButton";

export const dynamic = 'force-dynamic';

export default async function ManageProductsPage() {
  await dbConnect();
  
  const rawProducts = await Product.find({}).sort({ name: 1 });
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-stone-50 min-h-screen font-sans pb-24">
      
      {/* --- NAVIGATION & HEADER --- */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/admin" 
          className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-xs md:text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden xs:inline">Back to Orders</span>
          <span className="xs:hidden">Back</span>
        </Link>
      </div>

      <div className="bg-stone-900 text-white p-5 md:p-7 rounded-t-[2rem] md:rounded-t-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-2xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
            <Coffee className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
            Management
          </h1>
          <p className="text-stone-400 text-[9px] md:text-xs uppercase tracking-widest mt-1">
            {products.length} Drinks Total
          </p>
        </div>
        <Link 
          href="/admin/add-coffee" 
          className="bg-orange-600 hover:bg-orange-500 px-4 py-2 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 transition-all shadow-lg text-[11px] md:text-sm font-black uppercase tracking-wider"
        >
          <Plus size={18} />
          <span>Add <span className="hidden sm:inline">Drink</span></span>
        </Link>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white border-x border-b border-stone-200 rounded-b-[2rem] md:rounded-b-3xl overflow-hidden shadow-xl">
        
        {/* MOBILE VIEW (Cards) - Shown on small screens, hidden on md+ */}
        <div className="md:hidden divide-y divide-stone-100">
          {products.length === 0 ? (
            <div className="p-10 text-center text-stone-400 italic text-sm">No drinks found.</div>
          ) : (
            products.map((product: any) => (
              <div key={product._id} className="p-4 flex items-center gap-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-100 shadow-sm" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-800 truncate">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-black text-orange-700">${product.price.toFixed(2)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <EditProductModal product={product} />
                  <DeleteProductButton productId={product._id} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW (Table) - Hidden on mobile, shown on md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Drink Details</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Inventory</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-14 h-14 rounded-2xl object-cover border border-stone-100" />
                      <div>
                        <div className="text-sm font-bold text-stone-800">{product.name}</div>
                        <div className="text-xs font-black text-orange-700">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${
                      product.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      <Package size={14} />
                      {product.stock} Units
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <EditProductModal product={product} />
                      <DeleteProductButton productId={product._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}