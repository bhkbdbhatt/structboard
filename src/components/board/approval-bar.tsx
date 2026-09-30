'use client';

import React from 'react';
import { useCanvasStore } from '@/lib/store';
import { BoardStatus } from '@/types/board';

const STATUS_CONFIG: Record<BoardStatus, { label: string; badge: string }> = {
    draft: { label: 'Draft', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
    in_review: { label: 'In Review', badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60' },
    approved: { label: 'Approved', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' },
    rejected: { label: 'Rejected', badge: 'bg-rose-950/60 text-rose-300 border-rose-800/60' }
};

export default function ApprovalBar() {
    const { status, setStatus } = useCanvasStore();

    return (
        <div className="flex items-center space-x-3 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${STATUS_CONFIG[status].badge}`}>
                {STATUS_CONFIG[status].label}
            </span>

            <div className="h-3 w-px bg-slate-800" />

            {status === 'draft' && (
                <button
                    onClick={() => setStatus('in_review')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
                >
                    Submit for Review →
                </button>
            )}

            {status === 'in_review' && (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setStatus('approved')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2 py-0.5 rounded transition"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => setStatus('rejected')}
                        className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium px-2 py-0.5 rounded transition"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}