"use client";

import { useState } from "react";
import { LogOut, ChevronDown, ShoppingCart, PlusCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const displayName = user.name || user.email.split("@")[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-orange-950/30 px-3 py-2 rounded-xl border border-orange-800/30"
      >
        <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        {/* On mobile, we change "Admin" label to just the arrow to save space */}
        <span className="text-sm font-bold hidden md:block text-white">Admin</span>
        <ChevronDown size={14} className={`text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-stone-50">
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Account</p>
              <p className="text-sm font-bold text-stone-900 truncate mt-1">{user.email}</p>
            </div>

            {/* --- THIS IS THE FIX FOR MOBILE --- */}
            {user.role === "admin" && (
              <div className="p-2 border-b border-stone-50 md:hidden"> 
                {/* Note: 'md:hidden' ensures these only show in the menu on MOBILE, 
                    since they are already visible in the navbar on Desktop */}
                <p className="px-3 pt-1 pb-2 text-[9px] font-black uppercase text-orange-600 tracking-widest">Management</p>
                
                <Link 
                  href="/admin/order" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-stone-700 hover:bg-orange-50 rounded-xl"
                >
                  <ShoppingCart size={16} className="text-orange-600" />
                  Orders
                </Link>

                <Link 
                  href="/admin/add-coffee" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-stone-700 hover:bg-orange-50 rounded-xl"
                >
                  <PlusCircle size={16} className="text-orange-600" />
                  Inventory
                </Link>
              </div>
            )}
            
            <div className="p-2">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}