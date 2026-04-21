import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) console.log("[auth] origin", origin, "host", host);
  return handler.GET(req);
};

export const POST = async (req: Request) => {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) console.log("[auth] origin", origin, "host", host);
  return handler.POST(req);
};
