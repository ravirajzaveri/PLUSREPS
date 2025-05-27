export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Sticky top header */}
      <div className="sticky top-0 z-50 bg-background">
        <Navbar />
      </div>

      {/* Scrollable content below */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Optional: Sticky bottom tab bar */}
      <div className="sticky bottom-0 z-50 bg-background border-t">
        <MobileNavBar />
      </div>
    </div>
  );
}
