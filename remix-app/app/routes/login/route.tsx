import { NavLink } from "@remix-run/react";

export default function Users() {
  return (
    <div className="bg-orange-600 h-full">
      <h1>Login</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </p>
    </div>
  );
}