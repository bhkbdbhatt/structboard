'use client';

import React from 'react';
import { useCanvasStore } from '@/lib/store';

export default function CursorOverlay() {
    const { presences } = useCanvasStore();

    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            {Object.values(presences).map((user) => (
                <div
                    key={user.id}
                    className="absolute flex items-center space-x-1 transition-all duration-100 ease-out"
                    style={{ left: `${user.x}px`, top: `${user.y}px` }}
                >
                    {/* Custom SVG Cursor Arrow */}
                    <svg
                        className="w-4 h-4"
                        style={{ color: user.color }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M3 3l7 18 3-7 7-3L3 3z" />
                    </svg>
                    <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white shadow-md whitespace-nowrap"
                        style={{ backgroundColor: user.color }}
                    >
                        {user.name}
                    </span>
                </div>
            ))}
        </div>
    );
}