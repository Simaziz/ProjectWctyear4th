import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    await dbConnect();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create the user
    // NOTE: In production, don't let users choose their own 'admin' role via the body.
    // For your first setup, you can set this to 'admin' manually.
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}