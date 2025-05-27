"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  const matches = useMediaQuery("(max-width: 1024px)");
  const [hydrated, setHydrated] = useState(false);
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExpand();
    }
  }, [matches, onCollapse, onExpand]);

  if (!hydrated) return null;

  return (
    <div
      className={cn(
        "flex-1",
        matches ? "ml-0" : collapsed ? "ml-[70px]" : "ml-60"
      )}
    >
      {children}
    </div>
  );
};
