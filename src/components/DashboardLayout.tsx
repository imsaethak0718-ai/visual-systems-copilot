"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Network,
  MessageSquare,
  FileText,
  Menu,
  X,
  Compass,
  Layers,
  Settings,
  ChevronRight,
  Database,
  Terminal,
  Activity,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationLinks: SidebarLink[] = [
  {
    name: "Upload",
    href: "/upload",
    icon: UploadCloud,
    description: "Upload system specifications",
  },
  {
    name: "Copilot Workspace",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Unified AI workspace",
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: FileText,
    description: "System specification",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white text-black font-semibold group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5 text-black" />
              <div className="absolute inset-0 rounded-lg bg-white/30 blur-sm group-hover:blur-md transition-all duration-300" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-sm text-white block">Visual Systems</span>
              <span className="text-[10px] text-zinc-500 font-mono -mt-1 block">COPILOT v1.0.0</span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Workspace
          </div>
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? "bg-zinc-800/80 text-white border-l-2 border-white pl-4"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                  <div className="flex-1">
                    <span className="block">{link.name}</span>
                  </div>
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  )}
                </span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-zinc-850 px-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Diagnostics
            </div>
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400" /> DB Nodes</span>
                <span className="font-mono text-zinc-500">142 Ok</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-400" /> APIs</span>
                <span className="font-mono text-zinc-500">28 Active</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-yellow-400" /> Risks</span>
                <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-mono text-[10px]">3 Warn</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center font-semibold text-xs text-white">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">John Doe</p>
              <p className="text-[10px] text-zinc-500 truncate">john.doe@enterprise.com</p>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#09090b] border-r border-zinc-850 flex flex-col md:hidden"
            >
              <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded bg-white text-black font-semibold">
                    <Layers className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-white">Visual Systems</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-850"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-900 text-white border-l-2 border-white pl-4"
                            : "text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-semibold text-xs text-white">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">John Doe</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 md:px-8 border-b border-zinc-800 bg-[#09090b]/50 backdrop-blur-md flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                workspace
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                AWS_Enterprise_Architecture.pdf
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <Compass className="w-3.5 h-3.5" /> Back to Landing Page
            </Link>
            <div className="h-4 w-[1px] bg-zinc-800 hidden lg:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400 font-mono">Parser Engine: Connected</span>
            </div>
          </div>
        </header>

        {/* Screen/Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/20 relative">
          <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />
          <div className="relative min-h-full p-4 md:p-8 z-10">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
