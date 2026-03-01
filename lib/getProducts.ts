import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getProducts(limit?: number) {
  await dbConnect();

  const query = Product.find({}).lean();

  if (limit) query.limit(limit);

  const products = await query;

  return JSON.parse(JSON.stringify(products));
}