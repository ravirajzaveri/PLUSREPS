"use client";

import { useState } from "react";

export const AdCreateForm = () => {
  const [form, setForm] = useState({
    title: "",
    videoUrl: "",
    durationSeconds: 10,
    type: "PRE_ROLL",
    isSkippable: true,
    cpmINR: 1000,
    dailyBudgetINR: 500,
    totalBudgetINR: 1000,
    startDate: "",
    endDate: "",
    categories: "",
    targetLocations: "",
    minInterestMatch: 0,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/ads/create", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          durationSeconds: parseInt(form.durationSeconds.toString(), 10),
          categories: form.categories.split(",").map((s) => s.trim()),
          targetLocations: form.targetLocations.split(",").map((s) => s.trim()),
          minInterestMatch: parseInt(form.minInterestMatch.toString(), 10),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      alert("✅ Ad submitted successfully!");
      setForm((f) => ({ ...f, title: "", videoUrl: "" }));
    } catch (err) {
      console.error("❌ Ad creation failed:", err);
      alert("Ad creation failed.");
    }
  };

  return (
    <div className="p-4 bg-background border rounded-xl max-w-lg space-y-3">
      <h2 className="text-lg font-semibold">Create New Ad</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
      <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="Video URL (Bunny.net)" className="w-full p-2 border rounded" />
      <input name="durationSeconds" type="number" value={form.durationSeconds} onChange={handleChange} placeholder="Duration (sec)" className="w-full p-2 border rounded" />
      <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="PRE_ROLL">Pre-roll</option>
        <option value="MID_ROLL">Mid-roll</option>
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="isSkippable" checked={form.isSkippable} onChange={handleChange} />
        Skippable
      </label>
      <input name="cpmINR" type="number" value={form.cpmINR} onChange={handleChange} placeholder="CPM INR" className="w-full p-2 border rounded" />
      <input name="dailyBudgetINR" type="number" value={form.dailyBudgetINR} onChange={handleChange} placeholder="Daily Budget INR" className="w-full p-2 border rounded" />
      <input name="totalBudgetINR" type="number" value={form.totalBudgetINR} onChange={handleChange} placeholder="Total Budget INR" className="w-full p-2 border rounded" />
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="categories" value={form.categories} onChange={handleChange} placeholder="Categories (comma-separated)" className="w-full p-2 border rounded" />
      <input name="targetLocations" value={form.targetLocations} onChange={handleChange} placeholder="Target Locations (comma-separated ISO codes)" className="w-full p-2 border rounded" />
      <input name="minInterestMatch" type="number" value={form.minInterestMatch} onChange={handleChange} placeholder="Min interest match" className="w-full p-2 border rounded" />
      <button onClick={handleSubmit} className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
        Submit Ad
      </button>
    </div>
  );
};
