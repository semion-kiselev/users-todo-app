import {NavLink} from "@remix-run/react";
import {ReactNode} from "react";

export const Layout = ({ children } : { children: ReactNode }) => {
  return (
    <div className="h-full bg-fuchsia-600 p-4 flex flex-col">
      <h1>Root layout</h1>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="text-blue-800 font-bold">
            <NavLink to="/users">Users</NavLink>
          </p>
          <p className="text-blue-800 font-bold">
            <NavLink to="/about">About</NavLink>
          </p>
        </div>
        <div>
          <p className="text-blue-800 font-bold">
            <NavLink to="/login">Login</NavLink>
          </p>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
};