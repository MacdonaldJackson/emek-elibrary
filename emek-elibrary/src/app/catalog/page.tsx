import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import BookCard from "@/components/catalog/BookCard";
import SearchAndFilters from "@/components/catalog/SearchAndFilters";

export const dynamic = "force-dynamic";

async function CatalogResults({
  q,
  category,
}: {
  q?: string;
  category?: string;
}) {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { author: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          category ? { category: { slug: category } } : {},
        ],
      },
      include: { category: { select: { name: true } } },
      orderBy: { title: "asc" },
      take: 60,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <SearchAndFilters categories={categories} />
      {books.length === 0 ? (
        <p className="text-valley-700/80">
          No books matched your search. Try a different title, author, or category.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}

export default function CatalogPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">
        <h1 className="font-serif text-3xl font-semibold text-valley-900 mb-2">
          Catalog
        </h1>
        <p className="text-valley-700/80 mb-8">
          Browse theology, church history, biblical studies, and more.
        </p>
        <Suspense fallback={<p className="text-valley-700/80">Loading catalog...</p>}>
          <CatalogResults q={searchParams.q} category={searchParams.category} />
        </Suspense>
      </main>
    </div>
  );
}
