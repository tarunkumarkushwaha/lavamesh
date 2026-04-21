import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
        console.log('Mesh Node Linked:', socket.id);

        socket.on('join-project', (projectId) => {
            socket.join(projectId);
            console.log(`Socket ${socket.id} joined Vault: ${projectId}`);

            // Request initial state from Admin in that room
            socket.to(projectId).emit('peer-joined-needs-data', { peerId: socket.id });
        });

        // ADD THIS: General sync listener for Admin updates
        socket.on('sync-vault-to-peers', ({ projectId, data }) => {
            // Broadcast the fresh project state to everyone else in the room
            socket.to(projectId).emit('sync-vault', data);
        });

        socket.on('transfer-initial-data', ({ peerId, projectData }) => {
            io.to(peerId).emit('sync-vault', projectData);
        });

        socket.on('send-proposal', (payload) => {
            const { projectId, proposal } = payload;
            socket.to(projectId).emit('receive-proposal', proposal);
        });

        socket.on('merge-approved', (payload) => {
            const { projectId, updatedProject } = payload;
            // Use io.to() so EVERYONE (including the Admin) stays in sync
            io.to(projectId).emit('sync-vault', updatedProject);
        });

        socket.on('disconnect', () => {
            console.log('Node Unlinked');
        });
    });

    res.end();
}