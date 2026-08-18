"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { AIWidgetProvider } from "@/components/ai/AIWidgetContext";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <AIWidgetProvider>{children}</AIWidgetProvider>
    </SessionProvider>
  );
}
