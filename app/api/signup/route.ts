import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const { email, connectionId, apiKey } = await request.json();

  if (!email || !connectionId || !apiKey) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("your_database_name");

  try {
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    await db.collection("users").insertOne({
      email,
      connectionId,
      apiKey,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
