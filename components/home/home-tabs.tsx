"use client";

import { useState } from "react";

const tabs = ["Following", "Live"];

export const HomeTabs = ({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("Live");

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex justify-around border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className={`flex-1 py-3 font-semibold ${
            activeTab === tab ? "border-b-2 border-purple-500 text-white" : "text-muted-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
