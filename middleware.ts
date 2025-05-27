import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/(browse)/(home)(.*)",     // ✅ allow home + subpaths
    "/(browse)/:username",      // ✅ stream pages
    "/:username",               // optional fallback
    "/api/webhooks(.*)",
    "/api/uploadthing",
    "/search",
    "/legal(.*)",
  ],
});


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
