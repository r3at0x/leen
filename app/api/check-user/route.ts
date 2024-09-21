import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const userCache = new Map();

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (userCache.has(email)) {
    return NextResponse.json(userCache.get(email));
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const user = await db.collection("users").findOne({ email });

    let result;
    if (user && user.connectionId && user.apiKey) {
      result = {
        exists: true,
        connectionId: user.connectionId,
        apiKey: user.apiKey,
      };
    } else {
      result = { exists: false };
    }

    userCache.set(email, result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
