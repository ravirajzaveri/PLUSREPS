"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const { collapsed } = useSidebar((state) => state);

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 flex-col h-full bg-background border-r border-[#2D2E35] z-50 transition-all duration-200",
        collapsed ? "w-[70px]" : "w-60"
      )}
    >
      {children}
    </aside>
  );
};
