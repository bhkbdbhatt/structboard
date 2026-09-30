import { BoardNode } from '@/types/board';

export function exportToMermaid(nodes: BoardNode[]): string {
    let mermaid = 'graph TD\n';

    function traverse(node: BoardNode, parentId?: string) {
        const sanitizeId = node.id.replace(/[^a-zA-Z0-9]/g, '_');
        const shape = node.type === 'dir' ? `[/${node.name}/]` : `[${node.name}]`;

        mermaid += `  ${sanitizeId}${shape}\n`;

        if (parentId) {
            const sanitizeParent = parentId.replace(/[^a-zA-Z0-9]/g, '_');
            mermaid += `  ${sanitizeParent} --> ${sanitizeId}\n`;
        }

        if (node.children) {
            node.children.forEach((child) => traverse(child, node.id));
        }
    }

    nodes.forEach((root) => traverse(root));
    return mermaid;
}