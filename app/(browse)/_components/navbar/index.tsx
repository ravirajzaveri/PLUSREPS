// app/(browse)/_components/navbar/index.tsx

import Link from "next/link";
import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#252731] z-49 px-2 lg:px-4 flex items-center justify-between shadow-md">
      {/* Left: Logo + Legal link stacked in flex row */}
      <div className="flex items-center space-x-4">
        <Logo />
        <Link
          href="/legal"
          className="text-sm text-white hover:underline"
        >
          Help
        </Link>
      </div>

      {/* Center: Search (remains responsive) */}
      <Search />

      {/* Right: Actions */}
      <Actions />
    </nav>
  );
};
