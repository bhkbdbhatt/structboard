'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/store';
import { exportToStructGuardYAML } from '@/lib/exporters/structguard';
import { exportToShellScript } from '@/lib/exporters/shell-script';
import { exportToMermaid } from '@/lib/exporters/mermaid';

interface ExportModalProps {
    onClose: () => void;
}

export default function ExportModal({ onClose }: ExportModalProps) {
    const { nodes } = useCanvasStore();
    const [tab, setTab] = useState<'yaml' | 'shell' | 'json' | 'mermaid'>('yaml');

    const yamlOutput = exportToStructGuardYAML(nodes);
    const shellOutput = exportToShellScript(nodes);
    const jsonOutput = JSON.stringify(nodes, null, 2);
    const mermaidOutput = exportToMermaid(nodes);

    const getOutput = () => {
        switch (tab) {
            case 'yaml':
                return yamlOutput;
            case 'shell':
                return shellOutput;
            case 'json':
                return jsonOutput;
            case 'mermaid':
                return mermaidOutput;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getOutput());
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-slate-100">Export Blueprint</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm">✕</button>
                </div>

                {/* Export Format Selector */}
                <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
                    <button
                        onClick={() => setTab('yaml')}
                        className={`px-3 py-1 text-xs rounded font-mono transition ${tab === 'yaml' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        structguard.yaml
                    </button>
                    <button
                        onClick={() => setTab('shell')}
                        className={`px-3 py-1 text-xs rounded font-mono transition ${tab === 'shell' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        shell (.sh)
                    </button>
                    <button
                        onClick={() => setTab('json')}
                        className={`px-3 py-1 text-xs rounded font-mono transition ${tab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        JSON
                    </button>
                    <button
                        onClick={() => setTab('mermaid')}
                        className={`px-3 py-1 text-xs rounded font-mono transition ${tab === 'mermaid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Mermaid
                    </button>
                </div>

                {/* Output Area */}
                <textarea
                    readOnly
                    value={getOutput()}
                    className="w-full h-64 font-mono text-xs p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none resize-none"
                />

                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Ready to copy and paste into your project or docs</span>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
                    >
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </div>
    );
}