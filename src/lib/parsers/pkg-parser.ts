import { BoardNode } from '@/types/board';

export function parsePackageJson(jsonString: string): BoardNode[] {
    try {
        const pkg = JSON.parse(jsonString);
        const rootName = pkg.name || 'node-project';

        const rootChildren: BoardNode[] = [
            { id: 'node-pkg', name: 'package.json', type: 'config' },
            { id: 'node-readme', name: 'README.md', type: 'doc' },
            {
                id: 'node-src',
                name: 'src',
                type: 'dir',
                children: [
                    { id: 'node-main', name: pkg.main || 'index.ts', type: 'file' }
                ]
            }
        ];

        if (pkg.devDependencies?.typescript) {
            rootChildren.push({ id: 'node-tsconfig', name: 'tsconfig.json', type: 'config' });
        }

        return [
            {
                id: 'node-root',
                name: rootName,
                type: 'dir',
                children: rootChildren
            }
        ];
    } catch (err) {
        console.error('Invalid package.json format:', err);
        return [];
    }
}