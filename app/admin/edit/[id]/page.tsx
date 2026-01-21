import { updateCoffee } from '../../actions'; // adjust path
import Product from '@/models/Product';

export default async function EditCoffeePage({ params }: { params: { id: string } }) {
  const product = await Product.findById(params.id);

  return (
    <form action={updateCoffee} className="flex flex-col gap-4">
      {/* Hidden inputs are crucial for the server action to know WHICH product to update */}
      <input type="hidden" name="id" value={product._id.toString()} />
      <input type="hidden" name="existingImage" value={product.image} />

      <input name="name" defaultValue={product.name} className="border p-2" />
      <input name="price" type="number" defaultValue={product.price} className="border p-2" />
      <input name="stock" type="number" defaultValue={product.stock} className="border p-2" />
      
      <p>Current Image:</p>
      <img src={product.image} alt="coffee" className="w-20 h-20" />
      <input name="image" type="file" />

      <button type="submit" className="bg-blue-500 text-white p-2">Update Coffee</button>
    </form>
  );
}