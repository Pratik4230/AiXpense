import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = (req: Request) => handler.GET(req);

export const POST = (req: Request) => handler.POST(req);
