import type { Metadata } from "next";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Systems Copilot - Understand Engineering Systems",
  description: "AI-powered frontend interface that understands complex engineering architectures, visual diagrams, dependency reports, and system topologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-zinc-800 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
