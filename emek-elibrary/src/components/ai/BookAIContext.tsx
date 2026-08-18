"use client";

import { useEffect } from "react";
import { useAIWidget } from "@/components/ai/AIWidgetContext";

/**
 * Invisible helper rendered on the book reader page. It registers the
 * currently-open book with the AI widget context so the floating assistant
 * knows to answer "using the book currently open," and clears itself when
 * the reader unmounts (e.g. navigating back to the catalog).
 */
export default function BookAIContext({
    bookId,
    bookTitle,
}: {
    bookId: string;
    bookTitle: string;
}) {
    const { setCurrentBook } = useAIWidget();

  useEffect(() => {
        setCurrentBook({ id: bookId, title: bookTitle });
        return () => setCurrentBook(null);
  }, [bookId, bookTitle, setCurrentBook]);

  return null;
}
