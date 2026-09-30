'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/store';
import { parseTreeOutput } from '@/lib/parsers/tree-parser';

interface ImportModalProps {
    onClose: () => void;
}

export default function ImportModal({ onClose }: ImportModalProps) {
    const [rawText, setRawText] = useState('');
    const { setNodes } = useCanvasStore();

    const handleImport = () => {
        if (!rawText.trim()) return;
        const importedNodes = parseTreeOutput(rawText);
        setNodes(importedNodes);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-lg p-6 space-y-4 shadow-xl">
                <h2 className="text-lg font-bold text-slate-100">Import Structure</h2>
                <p className="text-xs text-slate-400">
                    Paste the terminal output of a <code className="text-indigo-400">tree</code> command below to auto-generate a canvas layout.
                </p>

                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`my-project\n├── src\n│   ├── index.ts\n│   └── config.json\n└── README.md`}
                    className="w-full h-48 font-mono text-xs p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 outline-none focus:border-indigo-500"
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
                    >
                        Generate Nodes
                    </button>
                </div>
            </div>
        </div>
    );
}