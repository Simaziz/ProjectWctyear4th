import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-[100] backdrop-blur-md bg-orange-900/95 text-white shadow-xl border-b border-orange-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
        
        {/* Brand */}
        <Link href="/" className="font-black text-xl md:text-2xl flex items-center gap-2 group">
          <span className="group-hover:rotate-12 transition-transform">☕</span>
          <span className="tracking-tighter">Cozy Cup</span>
        </Link>
        
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/menu" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">
            Menu
          </Link>
          
          {/* WE REMOVE THE ADMIN LINKS FROM HERE 
              Because they are now INSIDE the UserMenu dropdown.
              This keeps the mobile navbar clean!
          */}
        {/* Inside Navbar.tsx */}
{session?.user?.role === "admin" && (
  <div className="hidden md:flex items-center gap-4 border-l border-orange-800 pl-8">
    <Link href="/admin/add-coffee" className="...">Inventory</Link>
    <Link href="/admin/order" className="...">Orders</Link>
  </div>
)}

          {session ? (
            /* The UserMenu handles the "admin" check internally now.
               When you click the 'A' on your phone, the links will appear.
            */
            <UserMenu user={session.user} />
          ) : (
            <Link 
              href="/login" 
              className="bg-white text-orange-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-50 transition-colors shadow-lg shadow-orange-950/20"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}