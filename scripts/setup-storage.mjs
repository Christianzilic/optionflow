import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data, error } = await supabase.storage.createBucket("deeds", {
  public: false,
  fileSizeLimit: 52428800, // 50 MB
});

if (error && error.message !== "The resource already exists") {
  console.error("Failed to create bucket:", error.message);
  process.exit(1);
}

console.log("✓ 'deeds' bucket ready");
