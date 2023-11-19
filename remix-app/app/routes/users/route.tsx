import { NavLink, Outlet } from "@remix-run/react";

export default function Users() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }} className="bg-red-400 h-full">
          <h1>Users List</h1>
          <p className="text-blue-800 font-bold">
            <NavLink to="./create">Create User</NavLink>
          </p>
          <p className="text-blue-800 font-bold">
            <NavLink to="/">Back</NavLink>
          </p>
          <Outlet />
        </div>
    );
}
