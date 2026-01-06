import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-orange-950 mb-4">
        Freshly Brewed, <br /> Just for You.
      </h1>
      <p className="text-lg text-stone-600 mb-8 max-w-md">
        Welcome to Cozy Cup. Grab your favorite coffee and start your day with a smile.
      </p>
      <div className="flex gap-4">
        <Link href="/menu" className="bg-orange-800 text-white px-8 py-3 rounded-full hover:bg-orange-900 transition">
          View Menu
        </Link>
        <Link href="/register" className="border border-orange-800 text-orange-800 px-8 py-3 rounded-full hover:bg-orange-50 transition">
          Join Now
        </Link>
      </div>
    </div>
  );
}