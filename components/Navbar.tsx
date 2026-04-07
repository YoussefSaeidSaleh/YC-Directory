import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";
import { Skeleton } from "./ui/skeleton";

function NavbarAuthFallback() {
  return (
    <div className="flex items-center gap-5">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}

const Navbar = () => {
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <Suspense fallback={<NavbarAuthFallback />}>
          <NavbarAuth />
        </Suspense>
      </nav>
    </header>
  );
};

export default Navbar;
