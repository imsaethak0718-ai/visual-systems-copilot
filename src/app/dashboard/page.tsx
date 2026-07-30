"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Activity, AlertTriangle, Sparkles, Send, User, Bot, HelpCircle, Network, Cpu, Info, Maximize2, ZoomIn, ZoomOut, Settings } from "lucide-react";
import { loadAnalysis, demoAnalysis } from "@/lib/analysis";
import { motion } from "framer-motion";
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function WorkspacePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [analysis, setAnalysis] = useState(demoAnalysis);

  useEffect(() => {
    const loaded = loadAnalysis();
    if (loaded) setAnalysis(loaded);
    setIsMounted(true);
  }, []);

  const metadata = analysis.Metadata || demoAnalysis.Metadata!;
  const health = analysis.Health || demoAnalysis.Health!;
  
  // Graph State
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<any>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Chat State
  const initialMessages: Message[] = [
    { role: "assistant", content: `Hello! I have reviewed your ${metadata.files_processed?.length || 0} uploaded documents and generated the interactive graph. What questions do you have about the architecture?` }
  ];
  
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("visual-copilot-chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(initialMessages);
      }
    } else {
      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("visual-copilot-chat", JSON.stringify(messages));
    }
  }, [messages]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analysis.Components) return;
    const generatedNodes = analysis.Components.map((c, i) => {
      const cols = 2;
      const row = Math.floor(i / cols);
      const col = i % cols;
      const risk = c.risk_level || "";
      const status = risk.includes("Critical") || risk.includes("High") ? "Critical" : risk.includes("Medium") ? "Warning" : "Healthy";
      
      return {
        id: c.name,
        position: { x: col * 280, y: row * 150 },
        data: { 
          label: (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>{c.type || "Service"}</span>
                <span className={`w-2 h-2 rounded-full ${status === "Healthy" ? "bg-emerald-500" : status === "Warning" ? "bg-yellow-500" : "bg-rose-500 animate-pulse"}`} />
              </div>
              <strong className="text-sm text-white">{c.name}</strong>
              <span className="text-[10px] text-zinc-500 truncate">{c.technology || "Unknown"}</span>
            </div>
          ),
          rawDetails: { type: c.type || "Service", status, tech: c.technology || "Unknown" },
          rawName: c.name
        },
        style: { 
          background: '#18181b', 
          color: '#fff', 
          border: '1px solid #27272a', 
          borderRadius: '12px', 
          padding: '12px',
          width: 200,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
        }
      };
    });
    
    const generatedEdges = analysis.Relationships?.map((r, i) => ({
      id: `e-${i}`,
      source: r.from_component || r.source || "",
      target: r.to_component || r.target || "",
      animated: true,
      style: { stroke: '#4f46e5', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#4f46e5',
      },
    })) || [];
    
    setRfNodes(generatedNodes);
    setRfEdges(generatedEdges);
  }, [analysis]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://127.0.0.1:8000" : "");
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to Copilot API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-4">
        {/* Left Pane: Graph & Analysis */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto pr-2 pb-4">
          
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white">System Architecture</h1>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-xs font-semibold">
              Gemma 4 Multimodal Analysis
            </span>
          </div>

          {/* ReactFlow Interactive Graph */}
          <div className="h-[400px] shrink-0 border border-zinc-800 rounded-xl bg-zinc-950 relative overflow-hidden">
            <ReactFlow 
              nodes={rfNodes} 
              edges={rfEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, node) => setSelectedNode(node)}
              fitView
              className="bg-zinc-950/40"
            >
              <Background color="#27272a" gap={16} size={1} />
              <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400 [&>button]:border-b-zinc-800 [&>button:hover]:bg-zinc-800" />
            </ReactFlow>
          </div>

          {/* Risk & Components Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 shrink-0">
            {/* Risks */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Identified Risks</h2>
              </div>
              <div className="space-y-3">
                {analysis.Risks?.map(risk => (
                  <div key={risk.title} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
                    <div className="flex justify-between gap-3 mb-1">
                      <p className="font-semibold text-xs text-white">{risk.title}</p>
                      <span className="text-[10px] font-bold text-rose-400">{risk.severity}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Node Details */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Node Inspector</h2>
              </div>
              {selectedNode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{selectedNode.data.rawName}</h3>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">{selectedNode.data.rawDetails.type}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-300 font-semibold">Status:</span> {selectedNode.data.rawDetails.status}</p>
                    <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-300 font-semibold">Tech:</span> {selectedNode.data.rawDetails.tech}</p>
                  </div>
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center text-center">
                  <p className="text-xs text-zinc-500 italic">Select a node from the interactive graph to view details.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Copilot Chat */}
        <div className="w-[400px] shrink-0 border border-zinc-800 rounded-xl bg-zinc-950/80 flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">Engineering Copilot</h2>
                <p className="text-[10px] text-zinc-400 font-mono">Gemma 4 • Context Locked</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-zinc-800" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"}`}>
                  {msg.role === "user" ? <User className="w-3.5 h-3.5 text-zinc-400" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-zinc-800 text-white rounded-tr-sm" : "bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-tl-sm whitespace-pre-wrap"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 relative z-10">
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the architecture..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              Responses are locked strictly to the uploaded architecture.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
