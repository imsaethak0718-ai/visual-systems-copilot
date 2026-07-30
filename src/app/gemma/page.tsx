"use client";

import { BrainCircuit, Eye, FileStack, GitMerge, LockKeyhole, Network, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const capabilities = [
  [Eye, "Vision-native understanding", "Reads diagrams, whiteboards, screenshots and PDF pages alongside their extracted text."],
  [GitMerge, "Cross-document reasoning", "Merges every uploaded artifact into one evidence-backed system model instead of isolated file summaries."],
  [Network, "Structured engineering output", "Produces components, dependencies, risks, health signals, and documentation ready for the graph and chat."],
  [LockKeyhole, "Transparent conclusions", "Each important risk includes an evidence explanation through the Why? interaction."],
];

export default function GemmaPage() {
  return <DashboardLayout><div className="mx-auto max-w-6xl space-y-8">
    <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/15 via-zinc-950 to-zinc-950 p-8 sm:p-12"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-indigo-300"><Sparkles className="h-4 w-4" /> Why Gemma?</div><h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">Engineering reasoning that sees the whole system.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">Visual Systems Copilot uses Gemma as its core intelligence: it connects visual structure with text evidence to explain how an engineering system fits together.</p></section>
    <section className="grid gap-5 md:grid-cols-2">{capabilities.map(([Icon, title, description]) => { const I = Icon as typeof Eye; return <article key={String(title)} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6"><I className="h-5 w-5 text-indigo-400" /><h2 className="mt-5 text-lg font-semibold text-white">{title as string}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{description as string}</p></article>; })}</section>
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-7"><div className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-emerald-400" /><h2 className="text-xl font-bold text-white">The unified multimodal pipeline</h2></div><div className="mt-7 grid gap-3 md:grid-cols-6">{[[FileStack,"Upload artifacts"],[Eye,"Extract text + visual cues"],[GitMerge,"Merge evidence"],[BrainCircuit,"Gemma reasons across context"],[Network,"Structured system JSON"],[Sparkles,"Graph, risks, chat, docs"]].map(([Icon,label], index) => { const I=Icon as typeof Eye; return <div key={String(label)} className="relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"><span className="text-[10px] text-zinc-500">0{index + 1}</span><I className="mt-3 h-4 w-4 text-indigo-300" /><p className="mt-2 text-xs font-medium leading-5 text-zinc-300">{label as string}</p></div>; })}</div></section>
  </div></DashboardLayout>;
}
