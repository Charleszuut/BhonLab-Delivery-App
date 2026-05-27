// ============================================================
// supabase.js — Supabase client singleton
// Edit `SUPABASE_URL` and `SUPABASE_KEY` below to connect.
// ============================================================

const SUPABASE_URL = 'https://kiczyofdkytwxaqrtrls.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BoOfC_0bSJWYxAggkWaIwg_lh3VANmc';
 
let supabaseClient = null;

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL && SUPABASE_KEY &&
    !SUPABASE_URL.includes('YOUR_SUPABASE_URL') &&
    !SUPABASE_KEY.includes('YOUR_SUPABASE_KEY')
  );
}

function getAuthStorageSafe() {
  try {
    if (typeof getAuthStorage === 'function') return getAuthStorage();
  } catch (e) {
    // fall through
  }
  return undefined;
}

function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Configure SUPABASE_URL and SUPABASE_KEY in js/supabase.js before signing in.');
  }

  if (!supabaseClient) {
    const storage = getAuthStorageSafe();
    const authOptions = {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    };
    if (storage) authOptions.storage = storage;

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: authOptions
    });
  }

  return supabaseClient;
}
