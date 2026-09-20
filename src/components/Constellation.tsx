import React, { useState, useMemo } from 'react';
import { ConstellationNode, ConstellationEdge } from '../types/story';
import { Network, Eye, ArrowRight, X, Sparkles } from 'lucide-react';

interface ConstellationProps {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  onTraceThread: (node: ConstellationNode) => void;
}

export const Constellation: React.FC<ConstellationProps> = ({ nodes, edges, onTraceThread }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Position nodes in a visually harmonious organic layout
  const positionedNodes = useMemo(() => {
    const width = 960;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;

    return nodes.map((node, i) => {
      // Group-based positioning around central clusters
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = node.category === 'CHAPTER' ? 140 : node.category === 'MOMENT' ? 210 : 260;
      // Add slight jitter for natural star constellation look
      const jitterX = Math.sin(i * 3.7) * 24;
      const jitterY = Math.cos(i * 2.3) * 24;

      return {
        ...node,
        x: Math.max(50, Math.min(width - 50, centerX + Math.cos(angle) * radius + jitterX)),
        y: Math.max(50, Math.min(height - 50, centerY + Math.sin(angle) * radius + jitterY))
      };
    });
  }, [nodes]);

  const activeNodeId = hoveredNodeId || selectedNodeId;

  // Find connected node IDs
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const set = new Set<string>();
    set.add(activeNodeId);
    edges.forEach((edge) => {
      if (edge.source === activeNodeId) set.add(edge.target);
      if (edge.target === activeNodeId) set.add(edge.source);
    });
    return set;
  }, [activeNodeId, edges]);

  // Selected node details
  const selectedNode = positionedNodes.find((n) => n.id === selectedNodeId);

  // Color mapping by category (STRICTLY NO PURPLE)
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CHAPTER': return 'var(--accent-orange)';
      case 'MUSIC': return '#2D6A4F';
      case 'PURCHASE': return 'var(--accent-amber)';
      case 'HOUSEHOLD': return 'var(--accent-teal)';
      case 'MOMENT': return '#C84B26';
      case 'ROUTINE': return 'var(--accent-navy)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <section className="constellation-view paper-card" aria-labelledby="constellation-heading" style={{ padding: '2rem', marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Network size={14} />
            <span>Relationship Constellation • High-Value Nodes</span>
          </div>
          <h2 id="constellation-heading" style={{ fontSize: '1.875rem', marginTop: '0.25rem' }}>
            The Digital Constellation
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '620px', marginTop: '0.35rem' }}>
            Interactive relationship map connecting chapters, routines, convergent moments, and habits. Hover or click nodes to explore threads.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          {['CHAPTER', 'MUSIC', 'PURCHASE', 'HOUSEHOLD', 'MOMENT', 'ROUTINE'].map((cat) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getCategoryColor(cat) }} />
              <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        style={{
          background: 'var(--bg-canvas)',
          borderRadius: '6px',
          border: '1px solid var(--border-paper)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '440px'
        }}
      >
        <svg
          viewBox="0 0 960 520"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-labelledby="constellation-svg-title constellation-svg-desc"
        >
          <title id="constellation-svg-title">Digital Constellation Relationship Map</title>
          <desc id="constellation-svg-desc">Visual map connecting story chapters, routines, moments, and receipts across categories.</desc>
          {/* Edges */}
          <g className="edges">
            {edges.map((edge, i) => {
              const srcNode = positionedNodes.find((n) => n.id === edge.source);
              const tgtNode = positionedNodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isConnected =
                activeNodeId === edge.source || activeNodeId === edge.target;
              const isDimmed = activeNodeId && !isConnected;

              return (
                <line
                  key={i}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke={isConnected ? 'var(--accent-orange)' : 'var(--border-dashed)'}
                  strokeWidth={isConnected ? 2 : 1}
                  strokeDasharray={edge.type === 'recurrence' ? '4 3' : undefined}
                  opacity={isDimmed ? 0.15 : isConnected ? 1 : 0.5}
                  style={{ transition: 'all var(--transition-fast)' }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {positionedNodes.map((node) => {
              const isConnected = !activeNodeId || connectedNodeIds.has(node.id);
              const isHovered = activeNodeId === node.id;
              const isSelected = selectedNodeId === node.id;
              const color = getCategoryColor(node.category);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{
                    cursor: 'pointer',
                    opacity: isConnected ? 1 : 0.25,
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNodeId(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.category}: ${node.label}. ${node.info}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedNodeId(node.id);
                    } else if (e.key === 'Escape') {
                      setSelectedNodeId(null);
                    }
                  }}
                >
                  {/* Outer pulse ring for active/selected */}
                  {(isHovered || isSelected) && (
                    <circle
                      r={node.val * 0.7 + 8}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity="0.8"
                    />
                  )}

                  {/* Main node circle */}
                  <circle
                    r={node.val * 0.7}
                    fill={color}
                    stroke="var(--bg-card)"
                    strokeWidth="2"
                  />

                  {/* Node Label */}
                  <text
                    y={node.val * 0.7 + 14}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="11"
                    fontFamily="var(--font-display)"
                    fontWeight={isHovered || isSelected ? '700' : '500'}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Evidence Drawer / Card Overlay */}
        {selectedNode && (
          <div
            className="paper-card"
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              maxWidth: '340px',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 10,
              background: 'var(--bg-paper)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="receipt-stamp stamp-orange" style={{ fontSize: '0.6875rem' }}>
                {selectedNode.category}
              </span>
              <button
                onClick={() => setSelectedNodeId(null)}
                style={{ minHeight: '32px', minWidth: '32px', color: 'var(--text-muted)' }}
                aria-label="Close node inspector"
              >
                <X size={16} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
              {selectedNode.label}
            </h3>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {selectedNode.info}
            </p>

            <button
              onClick={() => onTraceThread(selectedNode)}
              style={{
                width: '100%',
                background: 'var(--accent-orange)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.8125rem',
                padding: '0.5rem',
                borderRadius: '3px'
              }}
            >
              <span>Trace this thread</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
