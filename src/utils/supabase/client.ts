import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabase_url || !supabase_anon_key) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase_client = createClient(supabase_url, supabase_anon_key);