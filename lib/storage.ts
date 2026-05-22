import "server-only";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const BUCKET = "deeds";

export async function uploadPdf(key: string, buffer: Buffer): Promise<string> {
  const { error } = await getClient().storage.from(BUCKET).upload(key, buffer, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return key;
}

export async function getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  const { data, error } = await getClient().storage.from(BUCKET).createSignedUrl(key, expiresInSeconds);
  if (error || !data) throw new Error(`Failed to create signed URL: ${error?.message}`);
  return data.signedUrl;
}
