import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket } from 'socket.io';

interface ChatRoom {
    name: string;
    users: Map<string, string>; // socketId -> name
    messages: Array<{
        name: string;
        message: string;
        timestamp: Date;
    }>;
}

const rooms = new Map<string, ChatRoom>();

export const setupChat = (httpServer: HTTPServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {
        let currentName: string | null = null;

        socket.on('set-name', (name: string) => {
            currentName = name;
            socket.emit('name-set', name);
            
            // Send current room list
            socket.emit('room-list', Array.from(rooms.keys()));
        });

        socket.on('create-room', (roomName: string) => {
            if (!currentName) return;

            if (!rooms.has(roomName)) {
                rooms.set(roomName, {
                    name: roomName,
                    users: new Map(),
                    messages: []
                });
                
                // Broadcast new room to all connected clients
                io.emit('room-list', Array.from(rooms.keys()));
            }
        });

        socket.on('join-room', (roomName: string) => {
            if (!currentName || !rooms.has(roomName)) return;

            // Leave current room if any
            Array.from(socket.rooms).forEach(room => {
                if (room !== socket.id) { // socket.id is the default room
                    leaveRoom(socket, room);
                }
            });

            // Join new room
            const room = rooms.get(roomName)!;
            socket.join(roomName);
            room.users.set(socket.id, currentName);

            // Notify others
            socket.to(roomName).emit('user-joined', currentName);
            
            // Send room history to the joining user
            socket.emit('room-history', room.messages);
        });

        socket.on('leave-room', (roomName: string) => {
            if (!currentName) return;
            leaveRoom(socket, roomName);
        });

        socket.on('chat-message', ({ room, message }: { room: string, message: string }) => {
            if (!currentName || !rooms.has(room)) return;

            const messageData = {
                name: currentName,
                message,
                timestamp: new Date()
            };

            // Store message
            const chatRoom = rooms.get(room)!;
            chatRoom.messages.push(messageData);

            // Broadcast to room
            io.to(room).emit('chat-message', messageData);
        });

        socket.on('disconnect', () => {
            if (!currentName) return;

            // Remove user from all rooms
            Array.from(socket.rooms).forEach(room => {
                if (room !== socket.id) {
                    leaveRoom(socket, room);
                }
            });

            // Clean up empty rooms
            for (const [roomName, room] of rooms) {
                if (room.users.size === 0) {
                    rooms.delete(roomName);
                    io.emit('room-list', Array.from(rooms.keys()));
                }
            }
        });
    });

    return io;
};

function leaveRoom(socket: Socket, roomName: string) {
    const room = rooms.get(roomName);
    if (!room) return;

    const name = room.users.get(socket.id);
    if (!name) return;

    room.users.delete(socket.id);
    socket.leave(roomName);
    socket.to(roomName).emit('user-left', name);

    // Clean up empty room
    if (room.users.size === 0) {
        rooms.delete(roomName);
        io.emit('room-list', Array.from(rooms.keys()));
    }
}
