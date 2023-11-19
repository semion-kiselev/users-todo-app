import { NavLink } from "@remix-run/react";

export default function CreateUser() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-green-400 h-full">
      <h1>Create User</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/users">Back</NavLink>
      </p>
    </div>
  );
}