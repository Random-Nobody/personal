import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface Room {
  users: Set<string>;
}

const rooms: Map<string, Room> = new Map();

export const setupWebRTC = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // In production, replace with your actual frontend domain
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', (roomId: string) => {
      // Create room if it doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { users: new Set() });
      }
      
      const room = rooms.get(roomId)!;
      room.users.add(socket.id);
      
      socket.join(roomId);
      
      // Notify others in the room
      socket.to(roomId).emit('user-connected', socket.id);
      
      // Send list of existing users to the new participant
      const usersInRoom = Array.from(room.users).filter(id => id !== socket.id);
      socket.emit('existing-users', usersInRoom);
      
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle WebRTC signaling
    socket.on('offer', ({ target, offer }) => {
      console.log(`Sending offer from ${socket.id} to ${target}`);
      socket.to(target).emit('offer', {
        offer,
        from: socket.id
      });
    });

    socket.on('answer', ({ target, answer }) => {
      console.log(`Sending answer from ${socket.id} to ${target}`);
      socket.to(target).emit('answer', {
        answer,
        from: socket.id
      });
    });

    socket.on('ice-candidate', ({ target, candidate }) => {
      console.log(`Sending ICE candidate from ${socket.id} to ${target}`);
      socket.to(target).emit('ice-candidate', {
        candidate,
        from: socket.id
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Remove user from all rooms
      rooms.forEach((room, roomId) => {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);
          io.to(roomId).emit('user-disconnected', socket.id);
          
          // Clean up empty rooms
          if (room.users.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });

  return io;
};
