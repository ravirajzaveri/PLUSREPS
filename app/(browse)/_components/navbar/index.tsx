// app/(browse)/_components/navbar/index.tsx

import Link from "next/link";
import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#252731] z-49 px-2 lg:px-4 flex items-center justify-between shadow-md">
      <Logo />

      {/* Simple Legal link */}
      <Link
        href="/legal/page"
        className="text-sm text-white hover:underline mr-4"
      >
        Legal & Help
      </Link>

      <Search />
      <Actions />
    </nav>
  );
};
