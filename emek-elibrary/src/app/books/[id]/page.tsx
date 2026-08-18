import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessBook } from "@/lib/access";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const [session, book] = await Promise.all([
    getServerSession(authOptions),
    prisma.book.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
  ]);

  if (!book) notFound();

  const hasAccess = canAccessBook(session, book.accessLevel);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <Link href="/catalog" className="text-sm text-gold-600 hover:underline">
          ← Back to catalog
        </Link>

        <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-8">
          <div className="aspect-[3/4] rounded-lg bg-valley-800 flex items-center justify-center p-4 text-center">
            {book.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverImageUrl} alt={`Cover of ${book.title}`} className="h-full w-full object-cover rounded-lg" />
            ) : (
              <span className="font-serif text-parchment-100">{book.title}</span>
            )}
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-gold-600 font-semibold">
              {book.category.name}
              {book.accessLevel === "RESTRICTED" && " · Licensed content"}
            </span>
            <h1 className="font-serif text-3xl font-semibold text-valley-900 mt-1">{book.title}</h1>
            <p className="text-valley-700/80 mt-1">
              {book.author}
              {book.publishedYear ? ` · ${book.publishedYear}` : ""}
            </p>
            {book.description && (
              <p className="mt-4 text-valley-800 leading-relaxed">{book.description}</p>
            )}

            <div className="mt-8">
              {hasAccess ? (
                <Link href={`/books/${book.id}/read`} className="btn-primary">
                  Start reading
                </Link>
              ) : (
                <Link href="/login" className="btn-primary">
                  Log in to read
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
