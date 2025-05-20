// pages/legal/index.tsx
"use client";

import Link from "next/link";

const legalPages = [
  {
    title: "Terms of Service",
    href: "/legal/terms",
  },
  {
    title: "Privacy Policy (India Only)",
    href: "/legal/privacy-india",
  },
  {
    title: "Safety Center",
    href: "/legal/safety",
  },
  {
    title: "Security Policy",
    href: "/legal/security",
  },
  {
    title: "Accessibility Statement",
    href: "/legal/accessibility",
  },
  {
    title: "Cookie Policy",
    href: "/legal/cookie-policy", // fixed typo from /cookies to /cookie-policy
  },
  {
    title: "Ad Choices Policy",
    href: "/legal/ad-choices",
  },
  {
    title: "Community Guidelines",
    href: "/legal/community-guidelines",
  },
];

export default function LegalIndex() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Legal & Help</h1>
      <ul className="space-y-4">
        {legalPages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="text-blue-600 hover:underline text-lg"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
