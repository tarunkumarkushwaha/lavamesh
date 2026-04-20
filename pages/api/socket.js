import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
    // Check if the socket server is already running
    if (res.socket.server.io) {
        console.log('Socket is already running');
        res.end();
        return;
    }

    console.log('Socket is initializing...');
    const io = new Server(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
        console.log('New Peer Connected:', socket.id);

        socket.on('join-project', (projectId) => {
            socket.join(projectId);

            // Notify the Admin that a new peer joined and needs the data
            socket.to(projectId).emit('peer-joined-needs-data', { peerId: socket.id });
        });

        // Admin sends the data to the specific new peer
        socket.on('transfer-initial-data', ({ peerId, projectData }) => {
            io.to(peerId).emit('sync-vault', projectData);
        });

        // Handle Pull Request / Proposals
        socket.on('send-proposal', (payload) => {
            const { projectId, proposal } = payload;
            // Broadcast to everyone in the project EXCEPT the sender
            socket.to(projectId).emit('receive-proposal', proposal);
        });

        // Handle Direct Admin Approval (Sync back to Peers)
        socket.on('merge-approved', (payload) => {
            const { projectId, updatedProject } = payload;
            io.to(projectId).emit('sync-vault', updatedProject);
        });

        socket.on('disconnect', () => {
            console.log('Peer disconnected');
        });
    });

    res.end();
}