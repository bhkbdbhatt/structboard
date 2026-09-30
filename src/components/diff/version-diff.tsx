'use client';

import React from 'react';
import { BoardNode } from '@/types/board';

interface VersionDiffProps {
    leftNodes: BoardNode[];
    rightNodes: BoardNode[];
}

export default function VersionDiff({ leftNodes, rightNodes }: VersionDiffProps) {
    // Collect full path names to perform key-based diffing
    const getFlatPaths = (nodes: BoardNode[], parentPath = ''): Map<string, BoardNode> => {
        const map = new Map<string, BoardNode>();
        nodes.forEach((node) => {
            const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
            map.set(currentPath, node);
            if (node.children) {
                const childMap = getFlatPaths(node.children, currentPath);
                childMap.forEach((v, k) => map.set(k, v));
            }
        });
        return map;
    };

    const leftMap = getFlatPaths(leftNodes);
    const rightMap = getFlatPaths(rightNodes);

    const allPaths = Array.from(new Set([...leftMap.keys(), ...rightMap.keys()])).sort();

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left Base Side */}
            <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 font-mono text-xs overflow-auto">
                <h3 className="text-slate-400 font-bold mb-3 border-b border-slate-800 pb-2">Base Version</h3>
                <div className="space-y-1">
                    {allPaths.map((path) => {
                        const inLeft = leftMap.has(path);
                        const inRight = rightMap.has(path);

                        if (!inLeft && inRight) {
                            return (
                                <div key={`left-${path}`} className="opacity-30 text-slate-600 line-through">
                                    - {path}
                                </div>
                            );
                        }

                        if (inLeft && !inRight) {
                            return (
                                <div key={`left-${path}`} className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-800/40">
                                    - {path} (Removed)
                                </div>
                            );
                        }

                        return (
                            <div key={`left-${path}`} className="text-slate-300 px-2 py-0.5">
                                {path}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Target Side */}
            <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 font-mono text-xs overflow-auto">
                <h3 className="text-slate-400 font-bold mb-3 border-b border-slate-800 pb-2">Target Version</h3>
                <div className="space-y-1">
                    {allPaths.map((path) => {
                        const inLeft = leftMap.has(path);
                        const inRight = rightMap.has(path);

                        if (inLeft && !inRight) {
                            return (
                                <div key={`right-${path}`} className="opacity-30 text-slate-600 line-through">
                                    + {path}
                                </div>
                            );
                        }

                        if (!inLeft && inRight) {
                            return (
                                <div key={`right-${path}`} className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                                    + {path} (Added)
                                </div>
                            );
                        }

                        return (
                            <div key={`right-${path}`} className="text-slate-300 px-2 py-0.5">
                                {path}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}