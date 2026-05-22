import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { checkDeedExpiry } from "@/inngest/functions/checkDeedExpiry";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkDeedExpiry],
});
