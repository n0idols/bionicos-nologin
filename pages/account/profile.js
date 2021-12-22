import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const profileData = await supabase.auth.user();
    if (!profileData) {
      router.push("/signin");
    } else {
      setProfile(profileData);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/signin");
  }
  if (!profile) return null;
  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h1>{profile.email}</h1>
        <p>{profile.id}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}
