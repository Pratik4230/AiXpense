import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name } = body as { name?: string };

  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  if (name.trim().length > 100)
    return NextResponse.json(
      { error: "Name must be 100 characters or fewer" },
      { status: 400 },
    );


  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name: name.trim() },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {} as { callbackURL?: string; password?: string; token?: string },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
