import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessBook } from "@/lib/access";
import Header from "@/components/Header";
import PageFlipReader from "@/components/reader/PageFlipReader";
import BookAIContext from "@/components/ai/BookAIContext";

export const dynamic = "force-dynamic";

export default async function ReadBookPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/login?callbackUrl=/books/${params.id}/read`);
  }

  const [book, progress] = await Promise.all([
    prisma.book.findUnique({
      where: { id: params.id },
      include: { pages: { orderBy: { pageNumber: "asc" } }, category: true },
    }),
    prisma.readingProgress.findUnique({
      where: { userId_bookId: { userId: session.user.id, bookId: params.id } },
    }),
  ]);

  if (!book) notFound();
  if (!canAccessBook(session, book.accessLevel)) {
    redirect(`/books/${book.id}`);
  }
  if (book.pages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-16 text-center">
          <p className="text-valley-700/80">
            This book doesn&apos;t have any pages uploaded yet. Check back soon.
          </p>
          <Link href={`/books/${book.id}`} className="text-gold-600 hover:underline mt-4 inline-block">
            ← Back to book details
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment-100">
      <Header />
      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-10">
        <Link href={`/books/${book.id}`} className="text-sm text-gold-600 hover:underline">
          ← Back to book details
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-valley-900 mt-2 mb-6 text-center">
          {book.title}
        </h1>

        <PageFlipReader
          bookId={book.id}
          pages={book.pages}
          startPage={progress?.lastPage ?? 1}
        />
      </main>

      {/* Tells the floating AI widget which book is currently open, so it can
          answer using this book's content specifically. */}
      <BookAIContext bookId={book.id} bookTitle={book.title} />
    </div>
  );
}
