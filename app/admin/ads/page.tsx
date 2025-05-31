// app/admin/ads/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Ad {
  id: string;
  title: string;
  type: string;
  cpmINR: number;
  dailyBudgetINR: number;
  totalBudgetINR: number;
  active: boolean;
  sponsorName: string;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then((res) => res.json())
      .then(setAds)
      .catch((err) => console.error("❌ Failed to fetch ads:", err));
  }, []);

  const toggleAd = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/ads/${id}/toggle`, {
        method: "POST",
      });
      const updated = await res.json();
      setAds((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: updated.active } : a))
      );
    } catch (err) {
      console.error("❌ Failed to toggle ad:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">📊 All Ads</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>CPM</th>
            <th>Budget (Daily / Total)</th>
            <th>Sponsor</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} className="text-center border-t">
              <td className="p-1 truncate max-w-[100px]">{ad.id}</td>
              <td>{ad.title}</td>
              <td>{ad.type}</td>
              <td>₹{ad.cpmINR}</td>
              <td>
                ₹{ad.dailyBudgetINR} / ₹{ad.totalBudgetINR}
              </td>
              <td>{ad.sponsorName}</td>
              <td>{ad.active ? "✅ Active" : "⛔ Inactive"}</td>
              <td>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => toggleAd(ad.id)}
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
