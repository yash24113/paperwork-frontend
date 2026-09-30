import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Frontend Supabase client using the public anon key. Used for read-only
 * lookups (e.g. public storage URLs); all writes go through the backend API,
 * which uses the service-role key.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getPublicFileUrl(bucket: string, storagePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}
