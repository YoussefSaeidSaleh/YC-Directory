"use client";

import { handleSignIn, handleSignOut } from "./auth-actions";
import { BadgePlus, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function UserMenu({
  session,
}: {
  session:
    | {
        user?: {
          id?: string;
          image?: string | null;
          name?: string | null;
        };
      }
    | null;
}) {
  if (session && session?.user) {
    return (
      <>
        <Link href="/startup/create">
          <span className="max-sm:hidden">Create</span>
          <BadgePlus className="size-6 sm:hidden" />
        </Link>

        <form action={handleSignOut}>
          <button className=" cursor-pointer" type="submit">
            <span className="max-sm:hidden">Logout</span>
            <LogOut className="size-6 sm:hidden text-red-500 mt-1" />
          </button>
        </form>

        <Link href={`/user/${session.user.id}`}>
          <Avatar className="size-10">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
            />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <form action={handleSignIn}>
      <button className="cursor-pointer" type="submit">
        Login
      </button>
    </form>
  );
}

export default UserMenu;
