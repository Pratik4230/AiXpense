import { serve } from "inngest/next";
import { inngest, functions } from "@/inngest/index";

export const maxDuration = 60;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
  servePath: "/api/inngest",
});
