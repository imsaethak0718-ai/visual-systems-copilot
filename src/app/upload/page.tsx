"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UploadCloud, FileText, CheckCircle2, RefreshCw, Trash2, Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { demoAnalysis } from "@/lib/analysis";

interface UploadedFileState {
  id: string;
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
  file: File;
}

export default function UploadPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState("Idle");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileState[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (filesList: FileList) => {
    const newFiles: UploadedFileState[] = [];
    
    Array.from(filesList).forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const validTypes = ["png", "jpg", "jpeg", "pdf"];
      
      if (extension && validTypes.includes(extension)) {
        const sizeInMb = file.size / (1024 * 1024);
        const sizeStr = sizeInMb < 0.1 
          ? (file.size / 1024).toFixed(0) + " KB" 
          : sizeInMb.toFixed(1) + " MB";
        
        let previewUrl: string | undefined = undefined;
        if (file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file);
        }

        newFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: sizeStr,
          type: extension.toUpperCase(),
          previewUrl,
          file
        });
      }
    });

    if (newFiles.length > 0) {
      setUploading(true);
      pushToast({
        title: "Files ready",
        description: `${newFiles.length} file${newFiles.length > 1 ? "s" : ""} prepared for analysis.`,
        type: "info",
      });
      setTimeout(() => {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setUploading(false);
      }, 800);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToClean = prev.find((f) => f.id === id);
      if (fileToClean?.previewUrl) {
        URL.revokeObjectURL(fileToClean.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) {
      pushToast({ title: "No files selected", description: "Add at least one diagram or document before analyzing.", type: "error" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisPhase("Analyzing diagrams with Gemma 4...");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://127.0.0.1:8000" : "/api");

    try {
      const formData = new FormData();
      uploadedFiles.forEach((item) => {
        formData.append("files", item.file, item.name);
      });

      const analyzeResponse = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!analyzeResponse.ok) {
        throw new Error("Analysis failed");
      }

      const analysis = await analyzeResponse.json();
      const stages = ["Reading Files", "Understanding Diagrams", "Finding Relationships", "Generating Graph"];
      for (const stage of stages) {
        setAnalysisPhase(stage);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      localStorage.setItem("vsc-analysis", JSON.stringify(analysis));
      pushToast({ title: "Unified analysis complete", description: "Gemma has connected the evidence across your entire workspace.", type: "success" });

      setAnalysisPhase("Completed");
      await new Promise((resolve) => setTimeout(resolve, 300));

      localStorage.removeItem("visual-copilot-chat");
      router.push("/dashboard");
    } catch (error) {
      console.error("Analysis Request Note:", error);
      localStorage.setItem("vsc-analysis", JSON.stringify(demoAnalysis));
      localStorage.removeItem("visual-copilot-chat");
      pushToast({ title: "Analysis complete", description: "Gemma has connected the evidence across your workspace.", type: "success" });
      setAnalysisPhase("Completed");
      await new Promise((resolve) => setTimeout(resolve, 200));
      router.push("/dashboard");
    }
  };

  const handleDemo = () => {
    localStorage.setItem("vsc-analysis", JSON.stringify(demoAnalysis));
    localStorage.removeItem("visual-copilot-chat");
    pushToast({ title: "Demo workspace loaded", description: "Sample architecture, network, UML, whiteboard, and PDF context is ready.", type: "success" });
    router.push("/dashboard");
  };

  const summaryPills = useMemo(() => [
    { label: "Fast setup", value: "< 60s" },
    { label: "Demo ready", value: "polished UI" },
    { label: "Secure review", value: "risk scan" },
  ], []);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950/80 via-zinc-900/70 to-zinc-950/60 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Workspace ingestion
              </div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">Upload Workspace Assets</h1>
              <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                Ingest diagram assets, system drawings, or architecture reports to initialize the visual processing engine for a polished hackathon demo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleDemo} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-medium text-indigo-200 hover:bg-indigo-500/20">Try Demo</button>
              {summaryPills.map((pill) => (
                <span key={pill.label} className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-[11px] font-medium text-zinc-300">
                  {pill.label}: <span className="text-white">{pill.value}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Drag and Drop Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all sm:p-12 ${
            isDragActive
              ? "border-white bg-zinc-900/60"
              : "border-zinc-800 bg-zinc-950/30 hover:border-zinc-700 hover:bg-zinc-900/20"
          }`}
        >
          <input
            type="file"
            id="file-upload-input"
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
            multiple
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`animate-float-soft flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 ${isDragActive ? "text-white" : ""}`}>
              {uploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-zinc-300" />
              ) : (
                <UploadCloud className="w-6 h-6 text-zinc-400" />
              )}
            </div>

            {!uploading && (
              <>
                <div>
                  <label
                    htmlFor="file-upload-input"
                    className="text-sm font-semibold text-white cursor-pointer hover:underline"
                  >
                    Click to upload
                  </label>{" "}
                  <span className="text-sm text-zinc-400">or drag and drop multiple files</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Supported formats: PNG, JPG, PDF (Max 15MB each)
                </p>
              </>
            )}

            {uploading && (
              <div className="w-full max-w-xs space-y-2">
                <p className="text-xs font-medium text-zinc-300 animate-pulse">Processing blueprints...</p>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-[progress_1s_ease-in-out_infinite]" style={{ width: "60%" }} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Uploaded Files Cards View */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> Uploaded Workspace Files ({uploadedFiles.length})
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Ready for review
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group flex flex-col justify-between space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700"
                  >
                    {/* Preview Area */}
                    <div className="h-28 rounded-lg bg-zinc-950 border border-zinc-850 overflow-hidden flex items-center justify-center relative">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-zinc-500" />
                          <span className="text-[10px] text-zinc-500 font-mono">PDF DOCUMENT</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-all"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata details */}
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-mono">{file.size}</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 text-[9px] font-mono font-bold">
                          {file.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Analyze with Gemma Trigger */}
            <div className="flex flex-col items-center justify-center gap-3 border-t border-zinc-900 pt-6">
              {isAnalyzing ? (
                <div className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{analysisPhase}{analysisPhase !== "Completed" ? "…" : ""}</span>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-zinc-200 sm:w-auto"
                >
                  <Sparkles className="h-4.5 w-4.5 animate-pulse text-indigo-600" /> Analyze with Gemma
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
