import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/(browse)/(home)",       // ✅ explicitly allow your home tab
    "/(browse)/(home)/live",    // ✅ add this line just in case
    "/(browse)/:username",   // ✅ Required if your stream route is inside /(browse) layout
    "/:username",            // ✅ Optional fallback for top-level user routes
    "/api/webhooks(.*)",
    "/api/uploadthing",
    "/:username",
    "/search",
    "/legal(.*)", // ← allow all legal pages
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
