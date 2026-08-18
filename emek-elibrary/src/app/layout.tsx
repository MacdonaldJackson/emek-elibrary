import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";
import AIWidget from "@/components/ai/AIWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emek E-LIBRARY — A Valley Where Truth is Found",
  description:
    "Emek E-LIBRARY is a public Christian digital library for Bible college students and others to study theology, church history, and biblical studies.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {children}
          {session ? <AIWidget /> : null}
        </Providers>
      </body>
    </html>
  );
}
