import { Navbar } from "../_components/navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Sticky Navbar for mobile */}
      <div className="sticky top-0 z-50 bg-background">
        <Navbar />
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pt-24">
        {children}
      </main>
    </div>
  );
}
