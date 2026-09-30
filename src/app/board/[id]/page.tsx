'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCanvasStore } from '@/lib/store';
import TreeCanvas from '@/components/board/tree-canvas';
import ApprovalBar from '@/components/board/approval-bar';
import CommentsPanel from '@/components/board/comments-panel';
import ExportModal from '@/components/export/export-modal';
import ImportModal from '@/components/board/import-modal';

export default function BoardPage() {
    const params = useParams();
    const boardId = params.id as string;
    const { setBoardId, status } = useCanvasStore();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    useEffect(() => {
        if (boardId) {
            setBoardId(boardId);
        }
    }, [boardId, setBoardId]);

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Top Navigation & Status Bar */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold tracking-wide text-indigo-400">structboard</h1>
                    <span className="text-slate-500">/</span>
                    <span className="text-sm font-medium text-slate-300">Board #{boardId}</span>
                </div>

                {/* Approval Workflow State Manager */}
                <ApprovalBar />

                {/* Action Controls */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                        Import Tree
                    </button>
                    <button
                        onClick={() => setIsExportOpen(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                    >
                        Export Blueprint
                    </button>
                </div>
            </header>

            {/* Main Collaborative Canvas Workspace */}
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 overflow-auto p-6 relative">
                    <TreeCanvas />
                </main>

                {/* Threaded Comments & Pin Sidebar */}
                <aside className="w-80 border-l border-slate-800 bg-slate-900/50 backdrop-blur p-4 overflow-y-auto">
                    <CommentsPanel />
                </aside>
            </div>

            {/* Modals */}
            {isExportOpen && <ExportModal onClose={() => setIsExportOpen(false)} />}
            {isImportOpen && <ImportModal onClose={() => setIsImportOpen(false)} />}
        </div>
    );
}