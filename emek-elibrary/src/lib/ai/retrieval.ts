import { prisma } from "@/lib/prisma";

/**
 * Retrieval for the AI assistant.
 *
 * This ships as keyword search (Postgres ILIKE) so the assistant works
 * out of the box with zero extra setup: it can already answer from (a) the
 * open book and (b) the wider library.
 *
 * `BookEmbedding` (see prisma/schema.prisma) already models a `pgvector`
 * column for a proper semantic-search upgrade later: generate embeddings
 * for each `BookPage` with an embedding model (e.g. Voyage AI, which
 * Anthropic recommends pairing with Claude), store them in
 * `BookEmbedding.embedding`, and swap the queries below for a
 * `ORDER BY embedding <=> $1` cosine-distance query. The rest of the AI
 * widget doesn't need to change.
 */

const STOPWORDS = new Set([
    "the", "a", "an", "of", "in", "on", "to", "and", "or", "is", "are", "was",
    "were", "what", "who", "how", "why", "does", "do", "did", "can", "for",
    "with", "about", "this", "that", "it", "as", "be", "by",
  ]);

function extractKeywords(text: string, max = 6): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    return Array.from(new Set(words)).slice(0, max);
}

export type RetrievedChunk = {
    bookTitle: string;
    bookAuthor: string;
    pageNumber: number;
    text: string;
};

/** Pull relevant passages from the book currently open, biased toward the reader's current page. */
export async function retrieveFromOpenBook(
    bookId: string,
    query: string,
    currentPage?: number
  ): Promise<RetrievedChunk[]> {
    const keywords = extractKeywords(query);

  const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: { title: true, author: true },
  });
    if (!book) return [];

  const matched = keywords.length
      ? await prisma.bookPage.findMany({
                where: {
                            bookId,
                            OR: keywords.map((kw) => ({ textContent: { contains: kw, mode: "insensitive" as const } })),
                },
                orderBy: { pageNumber: "asc" },
                take: 5,
      })
        : [];

  // Always include a couple of pages around where the reader currently is,
  // so "what does this page mean" style questions work even without a
  // keyword match.
  const nearby = currentPage
      ? await prisma.bookPage.findMany({
                where: { bookId, pageNumber: { gte: Math.max(1, currentPage - 1), lte: currentPage + 1 } },
                orderBy: { pageNumber: "asc" },
      })
        : [];

  const byId = new Map<string, (typeof matched)[number]>();
    for (const p of [...nearby, ...matched]) byId.set(p.id, p);

  return Array.from(byId.values())
      .filter((p) => p.textContent)
      .slice(0, 6)
      .map((p) => ({
              bookTitle: book.title,
              bookAuthor: book.author,
              pageNumber: p.pageNumber,
              text: p.textContent as string,
      }));
}

/** Search across the whole library (any book) for passages relevant to the question. */
export async function retrieveFromLibrary(
    query: string,
    excludeBookId?: string,
    limit = 5
  ): Promise<RetrievedChunk[]> {
    const keywords = extractKeywords(query);
    if (keywords.length === 0) return [];

  const pages = await prisma.bookPage.findMany({
        where: {
                bookId: excludeBookId ? { not: excludeBookId } : undefined,
                OR: keywords.map((kw) => ({ textContent: { contains: kw, mode: "insensitive" as const } })),
        },
        include: { book: { select: { title: true, author: true } } },
        take: limit,
  });

  return pages
      .filter((p) => p.textContent)
      .map((p) => ({
              bookTitle: p.book.title,
              bookAuthor: p.book.author,
              pageNumber: p.pageNumber,
              text: p.textContent as string,
      }));
}
