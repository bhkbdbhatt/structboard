'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VersionDiff from '@/components/diff/version-diff';
import { BoardVersion } from '@/types/board';

const MOCK_VERSIONS: BoardVersion[] = [
    {
        id: 'v1',
        versionNumber: 1,
        createdAt: '2026-09-28 10:00',
        createdBy: 'Alex',
        nodes: [
            {
                id: '1', name: 'src', type: 'dir', children: [
                    { id: '2', name: 'index.ts', type: 'file' },
                    { id: '3', name: 'config.json', type: 'config' }
                ]
            }
        ]
    },
    {
        id: 'v2',
        versionNumber: 2,
        createdAt: '2026-09-29 14:30',
        createdBy: 'Sarah',
        nodes: [
            {
                id: '1', name: 'src', type: 'dir', children: [
                    { id: '2', name: 'index.ts', type: 'file' },
                    { id: '3', name: 'config.json', type: 'config' },
                    { id: '4', name: 'index.test.ts', type: 'test' },
                    { id: '5', name: 'README.md', type: 'doc' }
                ]
            }
        ]
    }
];

export default function DiffPage({ params }: { params: { id: string } }) {
    const [leftVersionId, setLeftVersionId] = useState('v1');
    const [rightVersionId, setRightVersionId] = useState('v2');

    const leftVersion = MOCK_VERSIONS.find((v) => v.id === leftVersionId);
    const rightVersion = MOCK_VERSIONS.find((v) => v.id === rightVersionId);

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
            {/* Navigation Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center space-x-4">
                    <Link href={`/board/${params.id}`} className="text-xs text-indigo-400 hover:underline">
                        ← Back to Editor
                    </Link>
                    <span className="text-slate-600">|</span>
                    <h1 className="text-sm font-bold text-slate-200">Structural Version Diffing</h1>
                </div>

                {/* Version Selectors */}
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Base:</span>
                        <select
                            value={leftVersionId}
                            onChange={(e) => setLeftVersionId(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                        >
                            {MOCK_VERSIONS.map((v) => (
                                <option key={v.id} value={v.id}>
                                    v{v.versionNumber} ({v.createdBy} - {v.createdAt})
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-xs font-mono text-slate-500">VS</span>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Target:</span>
                        <select
                            value={rightVersionId}
                            onChange={(e) => setRightVersionId(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                        >
                            {MOCK_VERSIONS.map((v) => (
                                <option key={v.id} value={v.id}>
                                    v{v.versionNumber} ({v.createdBy} - {v.createdAt})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Diff Workspace */}
            <main className="flex-1 p-6 overflow-auto">
                <VersionDiff
                    leftNodes={leftVersion?.nodes || []}
                    rightNodes={rightVersion?.nodes || []}
                />
            </main>
        </div>
    );
}