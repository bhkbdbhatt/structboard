'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/store';

export default function CommentsPanel() {
    const { comments, selectedNodeId, addComment } = useCanvasStore();
    const [text, setText] = useState('');

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        addComment({
            id: `comment-${Date.now()}`,
            nodeId: selectedNodeId || 'general',
            author: 'Current User',
            content: text,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setText('');
    };

    const filteredComments = selectedNodeId
        ? comments.filter((c) => c.nodeId === selectedNodeId)
        : comments;

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Comments {selectedNodeId ? '(Pinned to Node)' : '(All Board)'}
                </h3>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {filteredComments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No comments pinned yet.</p>
                ) : (
                    filteredComments.map((comment) => (
                        <div key={comment.id} className="p-2.5 rounded bg-slate-800/50 border border-slate-700/50 text-xs">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-indigo-300">{comment.author}</span>
                                <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                            </div>
                            <p className="text-slate-300">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handlePostComment} className="mt-auto space-y-2">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={selectedNodeId ? "Add a comment on selected node..." : "Add general board comment..."}
                    className="w-full text-xs p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none h-20"
                />
                <button
                    type="submit"
                    className="w-full text-xs font-medium py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
                >
                    Post Comment
                </button>
            </form>
        </div>
    );
}