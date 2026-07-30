export type Analysis = {
  Summary: string;
  Components: Array<{ name: string; type: string; description?: string; detail?: string; confidence?: number; technology?: string; dependencies?: string[]; risk_level?: string }>;
  Relationships: Array<{ from_component?: string; to_component?: string; source?: string; target?: string; description?: string; detail?: string; confidence?: number }>;
  Risks: Array<{ severity: string; title: string; description: string; confidence?: number; rationale?: string }>;
  Recommendations: Array<{ title: string; description: string }>;
  Metadata?: { files_processed?: string[]; confidence?: number; processing_time_ms?: number; model?: string };
  Health?: Record<string, number>;
};

export const demoAnalysis: Analysis = {
  Summary: "A resilient commerce platform with a protected edge, identity-aware services, and an event-driven data layer. The unified review found one availability concern around billing and a missing observability link.",
  Components: [
    { name: "Edge Gateway", type: "Gateway", description: "Routes external traffic and applies edge policies.", technology: "Kong", confidence: 96, risk_level: "Low", dependencies: ["Identity Service", "Billing Engine"] },
    { name: "Identity Service", type: "Service", description: "Issues tokens and evaluates access policies.", technology: "OAuth 2.0", confidence: 94, risk_level: "Low", dependencies: ["Analytics Store"] },
    { name: "Billing Engine", type: "Service", description: "Processes subscriptions and billing events.", technology: "Go", confidence: 89, risk_level: "Medium", dependencies: ["Analytics Store"] },
    { name: "Analytics Store", type: "Database", description: "Stores audit and operational events.", technology: "PostgreSQL", confidence: 91, risk_level: "Medium", dependencies: [] },
  ],
  Relationships: [{ source: "Edge Gateway", target: "Identity Service", detail: "OAuth handoff and policy validation.", confidence: 95 }, { source: "Edge Gateway", target: "Billing Engine", detail: "Routes billing API traffic.", confidence: 89 }, { source: "Billing Engine", target: "Analytics Store", detail: "Writes usage and billing events.", confidence: 87 }],
  Risks: [{ severity: "High", title: "Billing single point of failure", description: "No redundant billing path is visible in the supplied system context.", confidence: 88, rationale: "The gateway routes billing traffic to one service and no secondary instance or failover path was identified." }, { severity: "Medium", title: "Incomplete tracing coverage", description: "The analytics data path does not show distributed tracing for every service.", confidence: 76, rationale: "Service connections are present, but a telemetry collector or tracing relationship is not visible." }],
  Recommendations: [{ title: "Add a redundant billing path", description: "Deploy an independently scalable billing replica behind health checks." }, { title: "Standardize distributed tracing", description: "Propagate trace IDs through every gateway and service call." }],
  Metadata: { files_processed: ["architecture-overview.png", "network-topology.pdf", "service-notes.txt"], confidence: 91, processing_time_ms: 4820, model: "Gemma 4" },
  Health: { overall: 82, security: 88, performance: 79, scalability: 76, maintainability: 85, reliability: 80 },
};

export function loadAnalysis(): Analysis {
  if (typeof window === "undefined") return demoAnalysis;
  try { return JSON.parse(localStorage.getItem("vsc-analysis") || "") as Analysis; } catch { return demoAnalysis; }
}
