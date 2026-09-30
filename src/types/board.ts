export type NodeType = 'dir' | 'file' | 'config' | 'test' | 'doc';

export type BoardStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export interface BoardNode {
    id: string;
    name: string;
    type: NodeType;
    parentId?: string | null;
    children?: BoardNode[];
    description?: string;
}

export interface UserPresence {
    id: string;
    name: string;
    color: string;
    x: number;
    y: number;
    activeNodeId?: string;
}

export interface Comment {
    id: string;
    nodeId: string;
    author: string;
    content: string;
    createdAt: string;
    replies?: Comment[];
}

export interface BoardVersion {
    id: string;
    versionNumber: number;
    createdAt: string;
    createdBy: string;
    nodes: BoardNode[];
}

export interface Board {
    id: string;
    title: string;
    description?: string;
    status: BoardStatus;
    approvers: string[];
    nodes: BoardNode[];
    createdAt: string;
    updatedAt: string;
}