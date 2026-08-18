import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-parchment-200 bg-parchment-50/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-6 text-sm font-medium text-valley-800">
          <Link href="/catalog" className="hover:text-gold-600">Catalog</Link>
          {session?.user ? (
            <UserMenu name={session.user.name ?? session.user.email ?? "Reader"} />
          ) : (
            <>
              <Link href="/login" className="hover:text-gold-600">Log in</Link>
              <Link href="/signup" className="btn-primary">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
