import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Section from "@/components/Section";
import Auth from "@/components/Auth";
import Account from "@/components/Account";

export default function AccountIndex() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Section>
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </Section>
  );
}
