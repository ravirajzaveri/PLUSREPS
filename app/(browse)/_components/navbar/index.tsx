// app/(browse)/_components/navbar/index.tsx

import Link from "next/link";
import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#252731] z-49 px-2 lg:px-4 flex items-center justify-between shadow-md">
      {/* Left Section: Logo + Legal */}
      <div className="flex items-center space-x-4">
        <Logo />
        <Link
          href="/legal"
          className="text-sm text-white hover:underline"
        >
          Legal & Help
        </Link>
      </div>

      {/* Center: Search - absolutely centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
        <Search />
      </div>

      {/* Right: Actions */}
      <div>
        <Actions />
      </div>
    </nav>
  );
};
