'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StreamerSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    socialLink: '',
    category: '',
    bio: '',
    file: null as File | null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) body.append(key, value as string | Blob);
    });

    const res = await fetch('/api/streamer-signup', {
      method: 'POST',
      body,
    });

    if (res.ok) router.push('/thank-you');
    else alert('Something went wrong. Please try again.');

    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-white">
      <h1 className="text-4xl font-bold mb-4">Join the Fitverse Beta</h1>
      <p className="text-lg mb-8 text-gray-300">
        Be among the first to stream fitness content on Fitverse and grow your community from day one.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded bg-[#1e1f25] border border-gray-700 focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded bg-[#1e1f25] border border-gray-700"
        />

        <input
          type="text"
          name="socialLink"
          placeholder="Instagram or YouTube Link (optional)"
          value={form.socialLink}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded bg-[#1e1f25] border border-gray-700"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded bg-[#1e1f25] border border-gray-700"
        >
          <option value="" disabled>Select Fitness Category</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Yoga">Yoga</option>
          <option value="Dance">Dance</option>
          <option value="Cardio">Cardio</option>
          <option value="CrossFit">CrossFit</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="bio"
          placeholder="Tell us what makes your stream exciting..."
          value={form.bio}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded bg-[#1e1f25] border border-gray-700 min-h-[120px]"
        />

        <input
          type="file"
          name="file"
          accept="video/*"
          onChange={handleFileChange}
          className="text-gray-400"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded w-full"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
