import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";

const FEATURED_CATEGORIES = [
  { name: "Theology", slug: "theology", blurb: "Systematic and biblical theology from across church tradition." },
  { name: "Church History", slug: "church-history", blurb: "From the apostolic fathers to the modern missions movement." },
  { name: "Biblical Studies", slug: "biblical-studies", blurb: "Commentaries, original language tools, and hermeneutics." },
  { name: "Devotional & Christian Life", slug: "devotional", blurb: "Classic and contemporary works on discipleship and prayer." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-parchment-200 bg-parchment-50/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-6 text-sm font-medium text-valley-800">
            <Link href="/catalog" className="hover:text-gold-600">Catalog</Link>
            <Link href="/login" className="hover:text-gold-600">Log in</Link>
            <Link href="/signup" className="btn-primary">Create account</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-valley-900 text-parchment-50">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
            <Image
              src="/logo.jpg"
              alt="Emek E-LIBRARY"
              width={140}
              height={140}
              className="mx-auto mb-6 h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover shadow-lg"
              priority
            />
            <p className="uppercase tracking-[0.3em] text-gold-400 text-xs font-semibold mb-4">
              Emek E-LIBRARY
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-tight">
              A Valley Where Truth is Found
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-parchment-100/90 text-lg">
              A free, public digital library of Christian theology, church history, and
              biblical studies — built for Bible college students and every believer
              who wants to study Scripture and the great works of the church.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary bg-gold-500 hover:bg-gold-600 text-valley-900">
                Get free access
              </Link>
              <Link href="/catalog" className="btn-secondary border-parchment-100 text-parchment-50 hover:bg-parchment-50 hover:text-valley-900">
                Browse the catalog
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-serif text-2xl font-semibold text-valley-900 mb-2">
            Explore by category
          </h2>
          <p className="text-valley-700/80 mb-8">
            Every book is catalogued and searchable, with a realistic page-turning
            reader so studying feels like opening a physical volume.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}`}
                className="card p-6 flex flex-col gap-2"
              >
                <span className="font-serif text-lg font-semibold text-valley-900">
                  {cat.name}
                </span>
                <span className="text-sm text-valley-700/80">{cat.blurb}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-parchment-100 border-y border-parchment-200">
          <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">Free to join</h3>
              <p className="text-sm text-valley-700/80">
                Create an account with just your email — no cost, no gatekeeping, for
                students and lifelong learners alike.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">Reads like a real book</h3>
              <p className="text-sm text-valley-700/80">
                Our page-flip reader turns pages the way paper does, instead of an
                endless scroll — built for focused, distraction-free study.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">Study companion built in</h3>
              <p className="text-sm text-valley-700/80">
                An AI assistant is available on every page to help you understand what
                you&rsquo;re reading, find related material, or answer theology questions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-valley-700/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Emek E-LIBRARY. A Valley Where Truth is Found.</span>
        <span>Built for Bible college students, freely available to all.</span>
      </footer>
    </div>
  );
}
