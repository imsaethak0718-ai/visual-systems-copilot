"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, ArrowRight, Copy, Download, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function DocumentationPage() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copyState, setCopyState] = useState<string>("Copy");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://127.0.0.1:8000" : "/api");
        const res = await fetch(`${apiUrl}/documentation`);
        const data = await res.json();
        setMarkdown(data.markdown || "No documentation generated.");
      } catch (error) {
        setMarkdown("# Error\nFailed to fetch documentation from the backend API.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState("Copied");
      window.setTimeout(() => setCopyState("Copy"), 1400);
    } catch {
      setCopyState("Copy failed");
      window.setTimeout(() => setCopyState("Copy"), 1400);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system-documentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 border-b border-zinc-900 pb-5 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen className="h-4 w-4" />
              <span>Gemma 4 Generated</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-zinc-400">Context Locked</span>
            </div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <FileText className="h-6 w-6 text-indigo-400" /> System Specification
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} disabled={isLoading} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:opacity-50">
              <Copy className="h-4 w-4" /> {copyState}
            </button>
            <button onClick={handleDownload} disabled={isLoading} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white disabled:opacity-50">
              <Download className="h-4 w-4" /> Markdown
            </button>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-8 min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm">Gemma is drafting your documentation...</p>
            </div>
          ) : (
            <article className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
