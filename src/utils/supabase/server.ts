import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabase_url || !service_role_key) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase_server = createClient(supabase_url, service_role_key);