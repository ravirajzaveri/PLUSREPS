"use client";

interface HomeTabsProps {
  onTabChange: (tab: "Following" | "Live") => void;
  activeTab: "Following" | "Live";
}

export const HomeTabs = ({ onTabChange, activeTab }: HomeTabsProps) => {
  return (
    <div className="flex justify-around border-b border-white/10 bg-background">
      {["Following", "Live"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab as "Following" | "Live")}
          className={`flex-1 py-3 font-semibold ${
            activeTab === tab
              ? "text-white border-b-2 border-purple-500"
              : "text-muted-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
