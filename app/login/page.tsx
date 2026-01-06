"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // We handle the redirect manually
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/"); // Redirect to home on success
      router.refresh(); // Refresh navbar to show Admin/Logout buttons
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-stone-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-950">Welcome Back</h1>
          <p className="text-stone-500 mt-2">Log in to your Cozy Cup account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-stone-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-orange-800 rounded-lg hover:bg-orange-900 transition-colors disabled:bg-stone-400"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-orange-800 hover:underline">
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
}