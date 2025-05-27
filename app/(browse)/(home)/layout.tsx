import { Navbar } from "../_components/navbar";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-background">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pt-24">
        {children}
      </main>

      {/* Future: Sticky Tab Bar (optional) */}
      {/* <div className="sticky bottom-0 z-50 bg-background border-t">
        <MobileNavBar />
      </div> */}
    </div>
  );
};

export default BrowseLayout;
