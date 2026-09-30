import { Server as NetServer } from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { Server as ServerIO } from 'socket.io';

export const dynamic = 'force-dynamic';

let io: ServerIO;

export async function GET(req: NextRequest) {
    // Socket.IO server initialization wrapper for Next.js App Router
    if (!io) {
        const res = new NextResponse();
        // @ts-expect-error attaching socket server instance
        const server: NetServer = res.socket?.server;

        if (server) {
            io = new ServerIO(server, {
                path: '/api/socket',
                addTrailingSlash: false,
                cors: { origin: '*' }
            });

            io.on('connection', (socket) => {
                // Room join per board
                socket.on('join-board', (boardId: string) => {
                    socket.join(boardId);
                });

                // Real-time cursor movement
                socket.on('cursor-move', ({ boardId, user }) => {
                    socket.to(boardId).emit('cursor-updated', user);
                });

                // Node structure changes
                socket.on('tree-updated', ({ boardId, nodes }) => {
                    socket.to(boardId).emit('tree-changed', nodes);
                });

                // New comments pinned
                socket.on('comment-added', ({ boardId, comment }) => {
                    socket.to(boardId).emit('comment-received', comment);
                });

                // Workflow state transition
                socket.on('status-changed', ({ boardId, status }) => {
                    socket.to(boardId).emit('status-updated', status);
                });

                socket.on('disconnect', () => {
                    socket.broadcast.emit('user-disconnected', socket.id);
                });
            });
        }
    }

    return NextResponse.json({ success: true, message: 'Socket active' });
}