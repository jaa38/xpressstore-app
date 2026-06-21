// features/auth/services/session.ts

import { supabase } from "@/services/supabase/client";

// import { supabase } from "@/lib/supabase";
// ─── NO MORE MANUAL TOKEN STORAGE ────────────────────────────────────────────
// Previously this file manually copied access_token and refresh_token into
// SecureStore on every login. That created a second, independent copy of the
// session that Supabase's autoRefreshToken never knew about — so the two
// copies could silently drift out of sync.
//
// Supabase already persists the session in AsyncStorage (configured in
// client.ts with persistSession: true) and refreshes it automatically.
// There is now exactly ONE source of truth for session state: Supabase itself.

// Returns true if there is a currently valid session — used by the
// biometric login flow instead of reading a separately-stored token.
export async function hasValidSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

// Returns the current access token if a session exists, otherwise null.
// Reads directly from Supabase's managed session — never stale.
export async function getCurrentAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function clearSession(): Promise<void> {
  await supabase.auth.signOut();
}