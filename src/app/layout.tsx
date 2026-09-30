import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'structboard — Folder Structure Planner',
    description: 'Figma-like collaborative canvas for designing folder structures',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}