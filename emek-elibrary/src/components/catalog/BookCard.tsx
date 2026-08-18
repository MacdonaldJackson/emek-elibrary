import Link from "next/link";
import type { AccessLevel } from "@prisma/client";

export type BookCardData = {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  accessLevel: AccessLevel;
  category: { name: string };
};

export default function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link href={`/books/${book.id}`} className="card overflow-hidden flex flex-col group">
      <div className="aspect-[3/4] bg-valley-800 relative overflow-hidden">
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImageUrl}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center p-4 text-center">
            <span className="font-serif text-parchment-100 text-sm leading-snug">
              {book.title}
            </span>
          </div>
        )}
        {book.accessLevel === "RESTRICTED" && (
          <span className="absolute top-2 right-2 rounded-full bg-gold-500 text-valley-900 text-[10px] font-semibold uppercase tracking-wide px-2 py-1">
            Licensed
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-gold-600 font-semibold">
          {book.category.name}
        </span>
        <h3 className="font-serif font-semibold text-valley-900 leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-valley-700/80">{book.author}</p>
      </div>
    </Link>
  );
}
