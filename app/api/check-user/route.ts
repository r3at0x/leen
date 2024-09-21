import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const { email } = await request.json();

  console.log("Received email:", email); // Add this line

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    console.log("Database name:", process.env.MONGODB_DB_NAME); // Add this line
    console.log("Searching for user with email:", email); // Add this line

    const user = await db.collection("users").findOne({ email });

    console.log("User found in database:", user); // Add this line

    if (user && user.connectionId && user.apiKey) {
      console.log("User credentials found:", {
        email,
        connectionId: user.connectionId,
        apiKey: user.apiKey,
      });
      return NextResponse.json({
        exists: true,
        connectionId: user.connectionId,
        apiKey: user.apiKey,
      });
    } else {
      console.log("User not found or missing credentials:", email);
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
