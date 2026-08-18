"use client";

import { useRef, useState, useEffect } from "react";
import { useAIWidget } from "@/components/ai/AIWidgetContext";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AIWidget() {
  const { currentBook } = useAIWidget();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          bookId: currentBook?.id,
          history: nextMessages.slice(-10, -1),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Couldn't reach the assistant. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] bg-white rounded-xl shadow-2xl border border-parchment-200 flex flex-col overflow-hidden">
          <div className="bg-valley-900 text-parchment-50 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-serif font-semibold text-sm">Emek study assistant</p>
              <p className="text-xs text-parchment-100/70">
                {currentBook ? `Reading: ${currentBook.title}` : "Ask about the library or theology"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-parchment-50/70 hover:text-parchment-50"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.length === 0 && (
              <p className="text-sm text-valley-700/70">
                {currentBook
                  ? `Ask me anything about "${currentBook.title}", the wider library, or general Bible and theology questions.`
                  : "Ask me about any book in the library, or a general Bible or theology question."}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "self-end bg-gold-500 text-valley-900"
                    : "self-start bg-parchment-100 text-valley-900"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-parchment-100 text-valley-700/70 rounded-lg px-3 py-2 text-sm">
                Thinking...
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <form onSubmit={handleSend} className="border-t border-parchment-200 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-md border border-parchment-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Ask the study assistant"
            />
            <button type="submit" disabled={loading} className="btn-primary px-4 py-2 disabled:opacity-60">
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close study assistant" : "Open study assistant"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gold-500 text-valley-900 shadow-lg hover:bg-gold-600 flex items-center justify-center text-2xl transition-transform hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
