&#39;use client&#39;;

import { useState } from &#39;react&#39;;

export default function StreamerSignupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch(&#39;/api/streamer-signup&#39;, {
      method: &#39;POST&#39;,
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      e.currentTarget.reset();
    } else {
      alert(&#39;Something went wrong. Please try again.&#39;);
    }
  }

  return (
    <div className="min-h-screen bg-[#9147ff] text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-5xl font-bold text-black mb-4">Stream. Sweat. Earn.</h1>
      <p className="text-center max-w-xl text-lg mb-6">
        Be one of the first creators on <span className="font-bold">Fitverse</span> — the new home for live health & fitness streaming.<br />
        Connect with fans, go live, and earn from ads by top fitness brands & gyms.
      </p>

      {success ? (
        <p className="text-green-200 font-semibold">Thanks for signing up! We&#39;ll be in touch soon.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white text-black rounded-lg p-6 shadow-lg flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <input name="name" type="text" placeholder="Your name" required className="px-4 py-2 rounded-md border" />
          <input name="email" type="email" placeholder="Your email" required className="px-4 py-2 rounded-md border" />
          <input name="social" type="text" placeholder="Instagram/YouTube link" required className="px-4 py-2 rounded-md border" />
          <input name="niche" type="text" placeholder="Health & fitness style (e.g., HIIT, Yoga, Nutrition)" required className="px-4 py-2 rounded-md border" />
          <textarea
            name="pitch"
            placeholder="Tell us what makes your stream exciting"
            required
            className="px-4 py-2 rounded-md border min-h-[100px]"
            style={{ fontFamily: &#39;inherit&#39; }}
          />
          <input type="file" name="video" accept="video/*" className="px-2 py-1 border rounded-md" />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition"
          >
            {loading ? &#39;Submitting...&#39; : &#39;Sign Up&#39;}
          </button>

          <p className="text-xs text-gray-600 mt-2">
            By signing up, you agree to our{&#39; &#39;}
            <a href="/terms" className="underline text-blue-600" target="_blank">Terms of Service</a> and{&#39; &#39;}
            <a href="/privacy" className="underline text-blue-600" target="_blank">Privacy Policy</a>.
          </p>
        </form>
      )}

      <footer className="text-sm text-gray-200 mt-10 text-center">
        Built for the fitness community. By creators, for creators.
      </footer>
    </div>
  );
}
