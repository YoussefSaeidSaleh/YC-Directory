import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function NavbarAuth() {
  const session = await auth();

  return (
    <div className="flex items-center gap-5 text-black">
      <UserMenu session={session} />
    </div>
  );
}
