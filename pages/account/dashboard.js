import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome</h1>
      {JSON.stringify(user)}
    </div>
  );
}
