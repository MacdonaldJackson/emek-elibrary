"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchAndFilters({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") ?? "";

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: query || null });
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author..."
          className="flex-1 rounded-md border border-parchment-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          aria-label="Search the catalog"
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: null })}
          className={`rounded-full px-3 py-1.5 text-sm font-medium border ${
            activeCategory === ""
              ? "bg-valley-800 text-parchment-50 border-valley-800"
              : "border-parchment-200 text-valley-800 hover:border-valley-800"
          }`}
        >
          All categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParams({ category: cat.slug })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium border ${
              activeCategory === cat.slug
                ? "bg-valley-800 text-parchment-50 border-valley-800"
                : "border-parchment-200 text-valley-800 hover:border-valley-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
