"use client";

import { useState } from "react";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract first name or use the part of email before @
  const displayName = user.name || user.email.split("@")[0];

  return (
    <div className="relative">
      {/* Profile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-orange-950/30 hover:bg-orange-950/50 px-3 py-2 rounded-xl transition-all border border-orange-800/30"
      >
        <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold border border-orange-500 shadow-inner">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-bold hidden md:block capitalize">{displayName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-stone-50">
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Account</p>
              <p className="text-sm font-bold text-stone-900 truncate mt-1">{user.email}</p>
            </div>
            
            <div className="p-2">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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