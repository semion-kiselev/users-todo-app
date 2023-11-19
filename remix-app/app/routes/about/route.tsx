import { NavLink } from "@remix-run/react";

export default function About() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-gray-400 h-full">
      <h1>About</h1>
      <p className="text-blue-800 font-bold">
        <NavLink to="/">Back</NavLink>
      </p>
    </div>
  );
}