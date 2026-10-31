import { getUploadAuthParams } from "@imagekit/next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { hasPremiumAccess, premiumRequiredResponse } from "@/lib/premium";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await hasPremiumAccess(session.user.id))) return premiumRequiredResponse();

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
