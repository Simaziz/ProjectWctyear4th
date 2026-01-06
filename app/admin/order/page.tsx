import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  // 1. Security Check: Only allow logged-in users (you can add a role check here later)
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  
  // 2. Fetch all orders, newest first
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-stone-800">Customer Orders</h1>
      
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-stone-200">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-stone-600">Customer</th>
              <th className="px-6 py-4 font-semibold text-stone-600">Coffee</th>
              <th className="px-6 py-4 font-semibold text-stone-600">Price</th>
              <th className="px-6 py-4 font-semibold text-stone-600">Status</th>
              <th className="px-6 py-4 font-semibold text-stone-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order) => (
              <tr key={order._id.toString()} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 text-stone-800">{order.userEmail}</td>
                <td className="px-6 py-4 font-medium text-orange-900">{order.coffeeName}</td>
                <td className="px-6 py-4 text-stone-600">${order.price}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 uppercase">
                    {order.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-stone-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-10 text-center text-stone-500">
            No orders have been placed yet. ☕
          </div>
        )}
      </div>
    </div>
  );
}