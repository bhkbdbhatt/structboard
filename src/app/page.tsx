import Link from 'next/link';

export default function DashboardPage() {
    const mockBoards = [
        { id: '1', title: 'E-commerce Microservices Structure', status: 'Approved', updatedAt: '2 hours ago' },
        { id: '2', title: 'Next.js 15 Monorepo Architecture', status: 'In Review', updatedAt: '1 day ago' },
        { id: '3', title: 'Python FastApi Backend Layout', status: 'Draft', updatedAt: '3 days ago' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <header className="max-w-5xl mx-auto flex justify-between items-center mb-10 pb-4 border-b border-slate-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-indigo-400">structboard</h1>
                    <p className="text-xs text-slate-500 mt-1">Collaborative folder structure canvas and blueprint planner</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded shadow-sm transition">
                    + New Structure Board
                </button>
            </header>

            <main className="max-w-5xl mx-auto space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Your Boards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockBoards.map((board) => (
                        <Link key={board.id} href={`/board/${board.id}`}>
                            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group">
                                <h3 className="font-semibold text-slate-200 group-hover:text-indigo-400 text-sm mb-2">{board.title}</h3>
                                <div className="flex justify-between items-center text-xs text-slate-500 mt-4">
                                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{board.status}</span>
                                    <span>{board.updatedAt}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}