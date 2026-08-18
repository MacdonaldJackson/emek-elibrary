"use client";

import { signOut } from "next-auth/react";

export default function UserMenu({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-valley-800">
      <span className="hidden sm:inline">Hi, {name.split(" ")[0]}</span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="btn-secondary py-1.5 px-3"
      >
        Log out
      </button>
    </div>
  );
}
