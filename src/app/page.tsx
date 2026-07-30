"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  UploadCloud,
  Network,
  MessageSquare,
  ShieldAlert,
  Activity,
  Terminal,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      {/* Background grids and glowing radial colors */}
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-20" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 glass border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white text-black font-semibold">
            <Layers className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm text-white block">Visual Systems</span>
            <span className="text-[10px] text-zinc-500 font-mono -mt-1 block">COPILOT</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/upload">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer">
              Launch Workspace <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto text-center flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Production-Ready Enterprise System Parsing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent leading-[1.1] mb-6"
        >
          Visual Systems Copilot
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10"
        >
          AI that understands engineering systems, not just images. Turn system architecture diagrams, PDFs, and wireframes into interactive topologies instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center z-10"
        >
          <Link href="/upload">
            <span className="px-8 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-2 cursor-pointer text-sm">
              Launch Workspace <ArrowRight className="w-4.5 h-4.5" />
            </span>
          </Link>
          <Link href="/docs">
            <span className="px-8 py-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 transition-all flex items-center gap-2 cursor-pointer text-sm">
              Read Docs
            </span>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Engineered for Enterprise System Diagrams
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto">
              Built to parse structural layout logic, identify key components, check risks, and answer complex integration queries.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Multi-Format Ingestion</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Seamlessly upload PNG architectures, SVG diagrams, system manuals in PDF, or high-fidelity design screenshots.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Interactive Knowledge Graph</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Convert static files into connected relationship maps showing dependencies, data-flow directions, and component hierarchy.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Engineering Chat</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Interact directly with your architecture using natural language. Query latency parameters, single points of failure, or scaling models.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Risk & Vulnerability Analysis</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Identify architectural red flags, public-subnet exposure, database bottlenecks, or missing validation gateways.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Auto-Generated Spec</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Extract schema files, structural summaries, API configurations, and endpoints instantly from visual design assets.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:border-zinc-800 transition-all hover:bg-zinc-900/60 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">Cost & Traffic Simulator</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Model component loads and verify how traffic peaks or offline services impact upstream infrastructure.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              How Visual Systems Copilot Works
            </h2>
            <p className="text-zinc-500 text-sm">
              From an uploaded image to a complete interactive understanding in three steps.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                1
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  Ingest Assets <Cpu className="w-4.5 h-4.5 text-indigo-400" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Drag and drop your engineering assets—architectural drawings, infrastructure exports, UML diagrams, or scan PDFs. The parser will immediately begin processing.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                2
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  Analyze & Diagram <Network className="w-4.5 h-4.5 text-emerald-400" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The engine parses components, database layers, connections, and external API requests, converting static layout maps into an interactive relational graph.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                3
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  Interact & Generate <MessageSquare className="w-4.5 h-4.5 text-cyan-400" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Chat with your system specification in real-time, generate structured OpenAPI schemas, or review auto-generated risk mitigation documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-white" />
            <span className="font-bold text-xs tracking-tight text-white">Visual Systems Copilot</span>
          </div>
          <p className="text-zinc-600 text-xs text-center md:text-left">
            &copy; 2026 Visual Systems Copilot. Designed for modern engineering dashboards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
