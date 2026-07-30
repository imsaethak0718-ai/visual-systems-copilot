"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastPayload {
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastItem extends ToastPayload {
  id: number;
  type: ToastType;
}

interface ToastContextValue {
  pushToast: (payload: ToastPayload) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((payload: ToastPayload) => {
    const id = Date.now() + Math.random();
    const nextToast: ToastItem = {
      id,
      type: payload.type ?? "info",
      title: payload.title,
      description: payload.description,
    };

    setToasts((prev) => [...prev, nextToast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="fixed right-4 top-4 z-[120] flex w-[min(92vw,360px)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const iconMap = {
              success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
              error: <AlertCircle className="h-5 w-5 text-rose-400" />,
              info: <Info className="h-5 w-5 text-sky-400" />,
            } as const;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900/80">
                    {iconMap[toast.type]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{toast.title}</p>
                    {toast.description ? <p className="mt-1 text-xs text-zinc-400">{toast.description}</p> : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
