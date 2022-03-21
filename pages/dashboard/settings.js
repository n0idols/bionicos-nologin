import { useEffect, useState } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Loading from "../../components/icons/Loading";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
export default function DashSettings() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [phone, setPhone] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, phone`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setPhone(data.phone);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, phone }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        phone,
        updated_at: new Date(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      toast.success("Profile Updated");
    }
  }

  const inputclass = `input input-primary w-full`;

  return (
    <>
      <div className="max-w-md mx-auto py-2">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => router.push("/dashboard")}
        >
          Back to Profile
        </button>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-4">
        <h1 className="text-center">Settings</h1>

        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className={inputclass}
          id="email"
          type="text"
          value={user.email}
          disabled
        />

        <label htmlFor="username" className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          className={inputclass}
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="phone" className="label">
          <span className="label-text">Phone</span>
        </label>
        <input
          className={inputclass}
          id="phone"
          type="phone"
          value={phone || ""}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="space-y-4 pt-4">
          <button
            className="btn btn-block  text-white"
            onClick={() => updateProfile({ username, phone })}
            disabled={loading}
          >
            {loading ? <Loading /> : "Update"}
          </button>

          {/* <button
            className="btn btn-block  btn-outline btn-accent"
            onClick={() => supabaseClient.auth.signOut()}
          >
            Sign Out
          </button> */}
        </div>
      </div>
    </>
  );
}
