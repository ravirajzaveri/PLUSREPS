"use client";

import { useState } from "react";
import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";
import Link from "next/link";
import { MoreVertical } from "lucide-react"; // Optional icon package

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#252731] z-49 px-2 lg:px-4 flex items-center justify-between shadow-md">
      <Logo />

      {/* Dots + dropdown */}
      <div className="relative mr-4">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white p-2 hover:bg-white/10 rounded-md focus:outline-none"
          aria-label="More options"
        >
          {/* Use Unicode dots or Lucide icon */}
          <span className="text-xl">&#8942;</span>
          {/* Or replace above with: <MoreVertical className="w-5 h-5" /> */}
        </button>

        {menuOpen && (
          <div className="absolute top-10 left-0 bg-white rounded shadow-md z-50">
            <Link
              href="/legal/page"
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Legal & Help
            </Link>
          </div>
        )}
      </div>

      <Search />
      <Actions />
    </nav>
  );
};
