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
        className="flex items-center gap-1.5 bg-orange-950/30 px-2.5 py-1.5 rounded-lg border border-orange-800/30"
      >
        <div className="w-6 h-6 rounded-full bg-orange-700 flex items-center justify-center text-[10px] font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-bold hidden md:block text-white">
          {user.role === "admin" ? "Admin" : displayName}
        </span>
        <ChevronDown size={11} className={`text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 border-b border-stone-50">
              <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest">Account</p>
              <p className="text-[11px] font-bold text-stone-900 truncate mt-0.5">{user.email}</p>
            </div>

            {user.role === "admin" && (
              <div className="p-1 border-b border-stone-50">
                <p className="px-2 pt-1 pb-1 text-[8px] font-black uppercase text-orange-600 tracking-widest">Management</p>

                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-stone-700 hover:bg-orange-50 rounded-lg"
                >
                  <ShoppingCart size={12} className="text-orange-600" />
                  Orders
                </Link>

                <Link
                  href="/admin/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-stone-700 hover:bg-orange-50 rounded-lg"
                >
                  <PlusCircle size={12} className="text-orange-600" />
                  Inventory
                </Link>
              </div>
            )}

            <div className="p-1">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}