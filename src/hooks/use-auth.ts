import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "subadmin" | "sales";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener FIRST (fires with initial session too)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const { data } = await supabase.rpc("get_user_role", {
              _user_id: session.user.id,
            });
            setRole((data as AppRole) || null);
          } catch {
            setRole(null);
          }
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Also call getSession to handle edge cases, with catch to prevent hangs
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const isAdmin = role === "admin";
  const isSubAdmin = role === "subadmin";
  const isSales = role === "sales";
  const canEdit = isAdmin || isSubAdmin;
  const hasAccess = isAdmin || isSubAdmin || isSales;

  return { user, session, role, loading, signOut, isAdmin, isSubAdmin, isSales, canEdit, hasAccess };
}
