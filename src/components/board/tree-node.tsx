'use client';

import React, { useState } from 'react';
import { BoardNode, NodeType } from '@/types/board';
import { useCanvasStore } from '@/lib/store';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface TreeNodeProps {
    node: BoardNode;
    index: number;
    level?: number;
}

const TYPE_COLORS: Record<NodeType, { badge: string; text: string; bg: string }> = {
    dir: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', text: 'text-amber-300', bg: 'hover:bg-amber-950/20' },
    file: { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30', text: 'text-sky-300', bg: 'hover:bg-sky-950/20' },
    config: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', text: 'text-purple-300', bg: 'hover:bg-purple-950/20' },
    test: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', text: 'text-emerald-300', bg: 'hover:bg-emerald-950/20' },
    doc: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', text: 'text-rose-300', bg: 'hover:bg-rose-950/20' }
};

export default function TreeNode({ node, index, level = 0 }: TreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [nodeName, setNodeName] = useState(node.name);

    const { selectedNodeId, selectNode, updateNode, deleteNode, addNode, moveNode } = useCanvasStore();
    const isSelected = selectedNodeId === node.id;

    const handleSave = () => {
        updateNode(node.id, nodeName, node.type);
        setIsEditing(false);
    };

    const handleAddChild = (e: React.MouseEvent, type: NodeType) => {
        e.stopPropagation();
        setIsExpanded(true);
        addNode(
            {
                id: `node-${Date.now()}`,
                name: type === 'dir' ? 'sub-folder' : 'file.ts',
                type: type,
                children: type === 'dir' ? [] : undefined,
            },
            node.id
        );
    };

    const handleMoveToRoot = (e: React.MouseEvent) => {
        e.stopPropagation();
        moveNode(node.id, null, 0); // Move node to top level (root)
    };

    return (
        <Draggable draggableId={node.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="select-none my-1"
                >
                    <div
                        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
                        onClick={(e) => {
                            e.stopPropagation();
                            selectNode(node.id);
                        }}
                        className={`flex items-center justify-between py-1.5 px-3 rounded-md border transition group cursor-pointer ${snapshot.isDragging ? 'bg-indigo-900/50 border-indigo-500 shadow-lg z-50' : TYPE_COLORS[node.type]?.bg || 'hover:bg-slate-800'
                            } ${isSelected ? 'border-indigo-500/80 bg-indigo-950/40 ring-1 ring-indigo-500/50' : 'border-slate-800/60'}`}
                    >
                        <div className="flex items-center space-x-2">
                            <span
                                {...provided.dragHandleProps}
                                className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing text-xs pr-1"
                                title="Drag to move into folder or reorder"
                            >
                                ⋮⋮
                            </span>

                            {node.type === 'dir' ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                    className="text-slate-400 hover:text-white w-4 text-xs font-mono"
                                >
                                    {isExpanded ? '▼' : '►'}
                                </button>
                            ) : (
                                <span className="w-4" />
                            )}

                            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${TYPE_COLORS[node.type]?.badge}`}>
                                {node.type}
                            </span>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={nodeName}
                                    onChange={(e) => setNodeName(e.target.value)}
                                    onBlur={handleSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    className="bg-slate-900 text-xs px-2 py-0.5 border border-indigo-500 rounded text-white outline-none"
                                    autoFocus
                                />
                            ) : (
                                <span
                                    onDoubleClick={() => setIsEditing(true)}
                                    className={`text-xs font-mono ${TYPE_COLORS[node.type]?.text || 'text-slate-200'}`}
                                >
                                    {node.name}
                                </span>
                            )}
                        </div>

                        {/* Actions Toolbar */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1.5 transition">
                            {/* Quick Action: Move Sub-folder/file to Root */}
                            {level > 0 && (
                                <button
                                    onClick={handleMoveToRoot}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                                    title="Move this item to Root Level"
                                >
                                    ↖ To Root
                                </button>
                            )}

                            {node.type === 'dir' && (
                                <>
                                    <button
                                        onClick={(e) => handleAddChild(e, 'dir')}
                                        className="text-[10px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 px-1.5 py-0.5 rounded border border-amber-500/30"
                                    >
                                        + Folder
                                    </button>
                                    <button
                                        onClick={(e) => handleAddChild(e, 'file')}
                                        className="text-[10px] bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 px-1.5 py-0.5 rounded border border-sky-500/30"
                                    >
                                        + File
                                    </button>
                                </>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="text-[10px] text-slate-400 hover:text-slate-200 px-1"
                            >
                                Rename
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(node.id);
                                }}
                                className="text-[10px] text-rose-400 hover:text-rose-300 px-1"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Children container */}
                    {node.type === 'dir' && isExpanded && (
                        <Droppable droppableId={node.id} type="NODE">
                            {(dropProvided, dropSnapshot) => (
                                <div
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    className={`border-l border-slate-800/80 ml-3 pl-1 min-h-[12px] transition ${dropSnapshot.isDraggingOver ? 'bg-indigo-950/20 rounded border-indigo-500/50' : ''
                                        }`}
                                >
                                    {node.children && node.children.map((childNode, childIdx) => (
                                        <TreeNode key={childNode.id} node={childNode} index={childIdx} level={level + 1} />
                                    ))}
                                    {dropProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )}
                </div>
            )}
        </Draggable>
    );
}