import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth(); // This checks if you are logged in

  return (
    <nav className="flex justify-between items-center p-4 bg-orange-900 text-white shadow-md">
      <Link href="/" className="font-bold text-xl">☕ Cozy Cup</Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/menu" className="hover:text-orange-200">Menu</Link>
        
        {/* Only show this if the user is an ADMIN */}
        {session?.user?.role === "admin" && (
          <Link href="/admin/add-coffee" className="bg-yellow-600 px-3 py-1 rounded text-sm font-bold">
            Admin Panel
          </Link>
        )}

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-80">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut(); }}>
              <button className="bg-white text-orange-900 px-3 py-1 rounded text-sm">Logout</button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="bg-orange-700 px-4 py-1 rounded hover:bg-orange-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}