'use client';

import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '@/lib/store';
import TreeNode from './tree-node';
import { NodeType } from '@/types/board';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';

export default function TreeCanvas() {
    const { nodes, addNode, selectNode, moveNode } = useCanvasStore();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    const handleAddRootFolder = () => {
        addNode({
            id: `node-${Date.now()}`,
            name: 'new-folder',
            type: 'dir',
            children: [],
        });
    };

    const handleAddRootFile = (type: NodeType = 'file') => {
        addNode({
            id: `node-${Date.now()}`,
            name: 'file.ts',
            type: type,
        });
    };

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const targetParentId = destination.droppableId === 'root' ? null : destination.droppableId;
        moveNode(draggableId, targetParentId, destination.index);
    };

    if (!enabled) return null;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div
                onClick={() => selectNode(null)}
                className="w-full h-full p-6 overflow-auto bg-slate-950/80 rounded-lg border border-slate-800 shadow-inner flex flex-col"
            >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Folder Canvas
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                            {nodes.length} root items
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleAddRootFolder}
                            className="px-3 py-1 text-xs font-mono font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 rounded transition"
                        >
                            + Root Folder
                        </button>
                        <button
                            onClick={() => handleAddRootFile('file')}
                            className="px-3 py-1 text-xs font-mono font-medium bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30 rounded transition"
                        >
                            + Root File
                        </button>
                    </div>
                </div>

                {/* Root Level Droppable Container */}
                <Droppable droppableId="root" type="NODE">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-[250px] p-2 transition rounded-lg ${snapshot.isDraggingOver ? 'bg-indigo-950/30 border-2 border-dashed border-indigo-500/60' : 'border border-transparent'
                                }`}
                        >
                            {nodes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg p-6">
                                    <p className="text-sm font-medium">Canvas is empty</p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Click "+ Root Folder" or "+ Root File" above to start designing your structure.
                                    </p>
                                </div>
                            ) : (
                                nodes.map((node, index) => (
                                    <TreeNode key={node.id} node={node} index={index} level={0} />
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}