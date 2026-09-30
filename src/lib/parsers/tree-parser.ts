import { BoardNode } from '@/types/board';

export function parseTreeOutput(treeText: string): BoardNode[] {
    const lines = treeText.split('\n').filter(line => line.trim().length > 0);
    const rootNodes: BoardNode[] = [];
    const stack: { depth: number; node: BoardNode }[] = [];

    lines.forEach((line, index) => {
        // Strip tree drawing characters (│, ├──, └──, etc.)
        const cleanLine = line.replace(/[│├└───\─\s]/g, ' ').trimEnd();
        const leadingSpaces = line.search(/[a-zA-Z0-9_\-\.]/);
        const depth = leadingSpaces > 0 ? Math.floor(leadingSpaces / 4) : 0;
        const name = cleanLine.trim();

        if (!name) return;

        const isDir = !name.includes('.') || name.endsWith('/');
        const cleanName = name.replace(/\/$/, '');

        let type: BoardNode['type'] = isDir ? 'dir' : 'file';
        if (cleanName.includes('config') || cleanName.endsWith('.json') || cleanName.endsWith('.yaml')) type = 'config';
        if (cleanName.includes('test') || cleanName.endsWith('.spec.ts')) type = 'test';
        if (cleanName.endsWith('.md') || cleanName.endsWith('.rst')) type = 'doc';

        const newNode: BoardNode = {
            id: `imported-${index}-${Date.now()}`,
            name: cleanName,
            type,
            children: isDir ? [] : undefined
        };

        while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
        }

        if (stack.length === 0) {
            rootNodes.push(newNode);
        } else {
            const parent = stack[stack.length - 1].node;
            if (parent.children) {
                parent.children.push(newNode);
            }
        }

        if (isDir) {
            stack.push({ depth, node: newNode });
        }
    });

    return rootNodes;
}