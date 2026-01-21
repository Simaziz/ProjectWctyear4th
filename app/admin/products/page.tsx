import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Coffee, Plus, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProductModal from "../../components/EditProductModal";
import DeleteProductButton from "../../components/DeleteProductButton";

export const dynamic = 'force-dynamic';

export default async function ManageProductsPage() {
  await dbConnect();
  
  // Fetch products and convert to plain objects for Client Components
  const rawProducts = await Product.find({}).sort({ name: 1 });
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-stone-50 min-h-screen font-sans pb-20">
      
      {/* Navigation Header */}
      <div className="mb-6">
        <Link 
          href="/admin" 
          className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-sm font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-stone-900 text-white p-6 rounded-t-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
            <Coffee className="text-orange-500" />
            Menu Management
          </h1>
          <p className="text-stone-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">
            {products.length} Drinks in Catalog
          </p>
        </div>
        <Link 
          href="/admin/add-coffee" 
          className="bg-orange-600 hover:bg-orange-500 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 text-sm font-black uppercase tracking-wider"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Add Drink</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded-b-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Drink Details</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400">Inventory</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-stone-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-stone-400 italic">
                    No drinks found in the menu. Click "Add Drink" to start.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full rounded-2xl object-cover shadow-sm border border-stone-100" 
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-stone-800 group-hover:text-orange-900 transition-colors">
                            {product.name}
                          </div>
                          <div className="text-xs font-black text-orange-700 mt-0.5">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${
                          product.stock > 10 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "bg-amber-50 text-amber-700"
                        }`}>
                          <Package size={14} />
                          {product.stock} Units
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end items-center gap-2">
                        {/* CLIENT COMPONENT: Handles the Edit Form logic 
                        */}
                        <EditProductModal product={product} />

                        {/* CLIENT COMPONENT: Handles the Delete confirmation 
                        */}
                        <DeleteProductButton productId={product._id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}