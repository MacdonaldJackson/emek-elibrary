"use client";

import { createContext, useContext, useMemo, useState } from "react";

type CurrentBook = { id: string; title: string } | null;

type AIWidgetContextValue = {
    currentBook: CurrentBook;
    setCurrentBook: (book: CurrentBook) => void;
};

const AIWidgetContext = createContext<AIWidgetContextValue | null>(null);

export function AIWidgetProvider({ children }: { children: React.ReactNode }) {
    const [currentBook, setCurrentBook] = useState<CurrentBook>(null);

  const value = useMemo(() => ({ currentBook, setCurrentBook }), [currentBook]);

  return <AIWidgetContext.Provider value={value}>{children}</AIWidgetContext.Provider>AIWidgetContext.Provider>;
}

export function useAIWidget() {
    const ctx = useContext(AIWidgetContext);
    if (!ctx) {
          throw new Error("useAIWidget must be used within an AIWidgetProvider");
    }
    return ctx;
}
