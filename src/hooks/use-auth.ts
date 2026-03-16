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
    let mounted = true;

    // Timeout fallback: if auth doesn't resolve in 5s, stop loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth loading timeout - forcing ready state");
        setLoading(false);
      }
    }, 5000);

    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const { data } = await supabase.rpc("get_user_role", {
              _user_id: session.user.id,
            });
            if (mounted) setRole((data as AppRole) || null);
          } catch {
            if (mounted) setRole(null);
          }
        } else {
          setRole(null);
        }
        if (mounted) setLoading(false);
      }
    );

    // Also call getSession as backup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
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
