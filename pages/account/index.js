// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Section from "@/components/Section";
// import Auth from "@/components/Auth";
// import Account from "@/components/Account";

// export default function AccountIndex() {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     setSession(supabase.auth.session());

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });
//   }, []);

//   return (
//     <Section>
//       {!session ? (
//         <Auth />
//       ) : (
//         <Account key={session.user.id} session={session} />
//       )}
//     </Section>
//   );
// }
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";

import { useRouter } from "next/router";

export default function AccountIndex({ user }) {
  const { authenticatedState } = useAuth();
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }
  return (
    <div>
      {" "}
      hey
      {authenticatedState === "authenticated" ? (
        <h1>logged in</h1>
      ) : (
        <h1>not logged in</h1>
      )}
      <button onClick={signOut} className="btn btn-warning">
        log out
      </button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
    };
  }

  /* if user is present, do something with the user data here */
  return { props: { user } };
}
