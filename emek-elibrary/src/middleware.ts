export { default } from "next-auth/middleware";

// Everything under these paths requires a signed-in session.
// The homepage, /login, and /signup stay public so visitors can learn about
// the library and create an account before seeing any content.
export const config = {
  matcher: ["/catalog/:path*", "/books/:path*", "/api/ai/:path*", "/api/progress/:path*"],
};
