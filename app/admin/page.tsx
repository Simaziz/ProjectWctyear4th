// app/admin/page.tsx
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    redirect("/login"); // Only admins can enter
  }

  return <h1>Welcome to Cozy Cup Management</h1>;
}