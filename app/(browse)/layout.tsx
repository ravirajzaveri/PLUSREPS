import { Suspense } from "react";

import { Navbar } from "./_components/navbar";
import { Sidebar, SidebarSkeleton } from "./_components/sidebar";
import { Container } from "./_components/container";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Navbar only on desktop */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="flex h-full pt-0 lg:pt-20">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;
