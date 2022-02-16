import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Link href="/account/dashboard">
          <a className="btn btn-ghost btn-sm text-gray-600">Account</a>
        </Link>

        {/* Signed in as {session.user.email} <br />
        <button
          className="btn btn-ghost btn-sm text-gray-600"
          onClick={() => signOut()}
        >
          Sign out
        </button> */}
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="btn btn-ghost btn-sm text-gray-600"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
