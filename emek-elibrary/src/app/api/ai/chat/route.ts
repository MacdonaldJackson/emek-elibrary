import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retrieveFromOpenBook, retrieveFromLibrary, type RetrievedChunk } from "@/lib/ai/retrieval";

export const runtime = "nodejs";

// See https://docs.claude.com/en/docs/about-claude/models for current model
// IDs — update this if Anthropic renames/retires the default.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  bookId: z.string().optional(),
  currentPage: z.number().int().positive().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
});

function formatChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "(none found)";
  return chunks
    .map((c) => `[${c.bookTitle} by ${c.bookAuthor}, p.${c.pageNumber}]\n${c.text}`)
    .join("\n\n");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The AI assistant isn't configured yet. Set ANTHROPIC_API_KEY in the server environment." },
      { status: 503 }
    );
  }

  const parsed = chatSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { message, bookId, currentPage, history = [] } = parsed.data;

  let openBookTitle: string | null = null;
  let openBookChunks: RetrievedChunk[] = [];
  if (bookId) {
    const book = await prisma.book.findUnique({ where: { id: bookId }, select: { title: true } });
    openBookTitle = book?.title ?? null;
    openBookChunks = await retrieveFromOpenBook(bookId, message, currentPage);
  }

  const libraryChunks = await retrieveFromLibrary(message, bookId, 5);

  const systemPrompt = `You are the Emek E-LIBRARY study assistant — "A Valley Where Truth is Found."
Emek E-LIBRARY is a free Christian digital library for Bible college students and other believers studying theology, church history, and biblical studies.

You can draw on three sources, in this priority order:
1. THE BOOK CURRENTLY OPEN — passages retrieved from the book the reader has open right now.
2. THE WIDER LIBRARY — passages retrieved from other books in the library.
3. YOUR GENERAL KNOWLEDGE of the Bible and Christian theology, when the library doesn't cover something.

Guidelines:
- When you use a retrieved passage, briefly cite it by book title and page (e.g. "Institutes of the Christian Religion, p.2").
- When you answer from general knowledge rather than the library, say so plainly (e.g. "This isn't from a book in the library, but generally in Christian theology...").
- Christians hold a range of convictions across denominations (e.g. on baptism, church governance, end times). When a question touches on one of these, represent the range of serious Christian positions fairly rather than asserting one as the only correct view, unless the retrieved book content is clearly making its own author's argument — in which case represent that author's view as theirs.
- Keep answers focused and study-friendly. Use short paragraphs; use a brief list only if the question calls for enumerating distinct items.
- If you don't know something and the library doesn't help, say so honestly rather than guessing.

${openBookTitle ? `The reader currently has "${openBookTitle}" open${currentPage ? ` (around page ${currentPage})` : ""}.` : "The reader is not currently inside a specific book."}

Relevant passages from the open book:
${formatChunks(openBookChunks)}

Relevant passages from elsewhere in the library:
${formatChunks(libraryChunks)}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user" as const, content: message },
      ],
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    // Best-effort chat log for future auditing/analytics; failures here
    // shouldn't break the response the user is waiting on.
    await prisma.chatMessage
      .createMany({
        data: [
          { userId: session.user.id, bookId: bookId ?? null, role: "user", content: message },
          { userId: session.user.id, bookId: bookId ?? null, role: "assistant", content: reply },
        ],
      })
      .catch(() => {});

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "The assistant couldn't respond right now. Please try again." },
      { status: 502 }
    );
  }
}
