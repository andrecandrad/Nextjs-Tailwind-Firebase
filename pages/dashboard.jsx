import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  //Check if user is logged

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
  };

  //Get user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>All your posts</h1>
      <div>posts</div>
      <button onClick={() => auth.signOut()} className="text-red-500">
        Sign Out
      </button>
    </div>
  );
}
