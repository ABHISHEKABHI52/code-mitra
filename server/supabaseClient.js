import { createClient } from "@supabase/supabase-js";

function readConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return { supabaseUrl, supabaseKey };
}

export function hasSupabaseConfig() {
  const { supabaseUrl, supabaseKey } = readConfig();
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabaseClient() {
  const { supabaseUrl, supabaseKey } = readConfig();
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}
