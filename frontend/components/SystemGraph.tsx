"use client";
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

type GraphComponent = { id?: string; name: string; type: string };
type GraphRelationship = { source: string; target: string; relation?: string };
type GraphData = { components: GraphComponent[]; relationships: GraphRelationship[] };

export default function SystemGraph({ data }: { data: GraphData }) {
  const nodes = data.components.map((c, i) => ({
    id: c.id || `component-${i}`,
    data: { label: `${c.name}\n(${c.type})` },
    position: { x: 80 + (i % 3) * 220, y: 70 + Math.floor(i / 3) * 150 },
    style: { background: '#1e1e2e', color: '#fff', border: '1px solid #6366f1', borderRadius: '8px' }
  }));

  const edges = data.relationships.map((r, i) => ({
    id: `e${i}`, source: r.source, target: r.target, label: r.relation, animated: true
  }));

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-white/10">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#222" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
