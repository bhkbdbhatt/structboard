import { create } from 'zustand';
import { BoardNode, UserPresence, Comment, BoardStatus, NodeType } from '@/types/board';

interface CanvasState {
    boardId: string | null;
    nodes: BoardNode[];
    selectedNodeId: string | null;
    status: BoardStatus;
    presences: Record<string, UserPresence>;
    comments: Comment[];

    setBoardId: (id: string) => void;
    setNodes: (nodes: BoardNode[]) => void;
    addNode: (newNode: BoardNode, parentId?: string | null) => void;
    updateNode: (id: string, name: string, type: NodeType) => void;
    deleteNode: (id: string) => void;
    selectNode: (id: string | null) => void;
    moveNode: (sourceId: string, targetParentId: string | null, targetIndex: number) => void;
    setStatus: (status: BoardStatus) => void;
    updatePresence: (user: UserPresence) => void;
    removePresence: (userId: string) => void;
    addComment: (comment: Comment) => void;
}

// Pure helper: Remove a node from a tree recursively
const removeNodeRecursive = (
    list: BoardNode[],
    targetId: string
): { updatedList: BoardNode[]; removedNode: BoardNode | null } => {
    let removedNode: BoardNode | null = null;

    const updatedList = list.reduce<BoardNode[]>((acc, item) => {
        if (item.id === targetId) {
            removedNode = item;
            return acc;
        }
        const itemCopy = { ...item };
        if (itemCopy.children) {
            const { updatedList: newChildren, removedNode: found } = removeNodeRecursive(itemCopy.children, targetId);
            if (found) removedNode = found;
            itemCopy.children = newChildren;
        }
        acc.push(itemCopy);
        return acc;
    }, []);

    return { updatedList, removedNode };
};

// Pure helper: Insert a node into a parent directory recursively
const insertNodeRecursive = (
    list: BoardNode[],
    targetParentId: string,
    nodeToInsert: BoardNode,
    targetIndex: number
): BoardNode[] => {
    return list.map((node) => {
        if (node.id === targetParentId) {
            const children = [...(node.children || [])];
            const insertIdx = Math.min(Math.max(0, targetIndex), children.length);
            children.splice(insertIdx, 0, nodeToInsert);
            return { ...node, children, type: 'dir' };
        }
        if (node.children && node.children.length > 0) {
            return {
                ...node,
                children: insertNodeRecursive(node.children, targetParentId, nodeToInsert, targetIndex)
            };
        }
        return node;
    });
};

export const useCanvasStore = create<CanvasState>((set) => ({
    boardId: null,
    nodes: [],
    selectedNodeId: null,
    status: 'draft',
    presences: {},
    comments: [],

    setBoardId: (id) => set({ boardId: id }),
    setNodes: (nodes) => set({ nodes }),

    addNode: (newNode, parentId = null) =>
        set((state) => {
            if (!parentId) {
                return { nodes: [...state.nodes, newNode] };
            }

            const appendChild = (list: BoardNode[]): BoardNode[] => {
                return list.map((node) => {
                    if (node.id === parentId) {
                        return {
                            ...node,
                            type: 'dir',
                            children: [...(node.children || []), newNode]
                        };
                    }
                    if (node.children?.length) {
                        return { ...node, children: appendChild(node.children) };
                    }
                    return node;
                });
            };

            return { nodes: appendChild(state.nodes) };
        }),

    updateNode: (id, name, type) =>
        set((state) => {
            const updateRecursive = (list: BoardNode[]): BoardNode[] =>
                list.map((node) => {
                    if (node.id === id) return { ...node, name, type };
                    if (node.children) return { ...node, children: updateRecursive(node.children) };
                    return node;
                });

            return { nodes: updateRecursive(state.nodes) };
        }),

    deleteNode: (id) =>
        set((state) => {
            const deleteRecursive = (list: BoardNode[]): BoardNode[] =>
                list
                    .filter((node) => node.id !== id)
                    .map((node) => ({
                        ...node,
                        children: node.children ? deleteRecursive(node.children) : []
                    }));

            return { nodes: deleteRecursive(state.nodes) };
        }),

    moveNode: (sourceId, targetParentId, targetIndex) =>
        set((state) => {
            const { updatedList: cleanedNodes, removedNode } = removeNodeRecursive(state.nodes, sourceId);
            if (!removedNode) return state;

            // Handle root level move
            if (!targetParentId || targetParentId === 'root') {
                const newNodes = [...cleanedNodes];
                const insertIdx = Math.min(Math.max(0, targetIndex), newNodes.length);
                newNodes.splice(insertIdx, 0, removedNode);
                return { nodes: newNodes };
            }

            // Handle nested folder move
            return {
                nodes: insertNodeRecursive(cleanedNodes, targetParentId, removedNode, targetIndex)
            };
        }),

    selectNode: (id) => set({ selectedNodeId: id }),
    setStatus: (status) => set({ status }),
    updatePresence: (user) => set((state) => ({ presences: { ...state.presences, [user.id]: user } })),
    removePresence: (userId) =>
        set((state) => {
            const next = { ...state.presences };
            delete next[userId];
            return { presences: next };
        }),
    addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] }))
}));