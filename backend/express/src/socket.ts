import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'socket.io';
import { webRTCConfig } from './config/webrtc';

interface User {
    socketId: string;
    name: string | null;
    streams: {
        video: boolean;
        audio: boolean;
    };
}

interface Message {
    name: string;
    content: string;
    type: 'chat' | 'system';
    timestamp: Date;
}

interface Room {
    name: string;
    users: Map<string, User>;
    messages: Message[];
}

const rooms = new Map<string, Room>();

export const setupSocket = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: webRTCConfig.cors
    });

    io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);
        let currentUser: User = { 
            socketId: socket.id, 
            name: null,
            streams: { video: false, audio: false }
        };

        // User Management
        socket.on('set-user', ({ name }: { name: string }) => {
            if (!name) return;
            currentUser.name = name;
            socket.emit('user-set', currentUser);
        });

        // Room Management
        socket.on('join-room', async (roomName: string) => {
            // Create room if it doesn't exist
            if (!rooms.has(roomName)) {
                rooms.set(roomName, {
                    name: roomName,
                    users: new Map(),
                    messages: []
                });
            }

            const room = rooms.get(roomName)!;

            // Leave any current rooms
            Array.from(rooms.keys()).forEach(name => {
                if (room.users.has(socket.id)) {
                    leaveRoom(name);
                }
            });

            // Join new room
            socket.join(roomName);
            room.users.set(socket.id, currentUser);

            // Notify others and send room state
            socket.to(roomName).emit('user-joined', {
                user: currentUser,
                timestamp: new Date()
            });

            // Send room state to joining user
            socket.emit('room-state', {
                users: Array.from(room.users.values()),
                messages: room.messages
            });

            // Send list of users that should initiate WebRTC connections
            const usersToConnect = Array.from(room.users.values())
                .filter(user => user.socketId !== socket.id)
                .map(user => user.socketId);
            
            if (usersToConnect.length > 0) {
                socket.emit('initialize-connections', usersToConnect);
            }
        });

        // Message Handling
        socket.on('message', ({ room: roomName, content, type = 'chat' }) => {
            const room = rooms.get(roomName);
            if (!room || !currentUser.name) return;

            const message: Message = {
                name: currentUser.name,
                content,
                type,
                timestamp: new Date()
            };

            room.messages.push(message);
            io.to(roomName).emit('message', message);
        });

        // WebRTC Signaling
        socket.on('signal', ({ target, data, type }) => {
            socket.to(target).emit('signal', {
                from: socket.id,
                data,
                type
            });
        });

        // Stream Status Updates
        socket.on('stream-status', ({ room: roomName, video, audio }) => {
            const room = rooms.get(roomName);
            if (!room) return;

            currentUser.streams = { video, audio };
            room.users.set(socket.id, currentUser);
            socket.to(roomName).emit('user-updated', currentUser);
        });

        // Helper function to handle room leaving
        const leaveRoom = (roomName: string) => {
            const room = rooms.get(roomName);
            if (!room) return;

            socket.leave(roomName);
            room.users.delete(socket.id);

            // Notify room
            io.to(roomName).emit('user-left', {
                user: currentUser,
                timestamp: new Date()
            });

            // Clean up empty rooms
            if (room.users.size === 0) {
                rooms.delete(roomName);
            }
        };

        // Disconnection handling
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            Array.from(rooms.keys()).forEach(roomName => {
                leaveRoom(roomName);
            });
        });
    });

    return io;
};
