"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the user in MongoDB
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // 2. SUCCESS! Now automatically log them in
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't reload the whole page yet
      });

      if (loginRes?.ok) {
        router.push("/"); // Send them to home page
        router.refresh(); // Refresh navbar to show "Logout"
      }
    } else {
      alert("Registration failed. Email might already exist.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-96 flex flex-col gap-4 border border-stone-100">
        <h1 className="text-2xl font-bold text-orange-950 text-center">Create Account</h1>
        
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 rounded-lg"
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border p-2 rounded-lg"
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button 
          disabled={loading}
          type="submit" 
          className="bg-orange-800 text-white p-2 rounded-lg hover:bg-orange-900 disabled:bg-stone-400"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}