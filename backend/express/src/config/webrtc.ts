export const webRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  cors: {
    origin: '*', // In production, replace with your actual frontend domain
    methods: ['GET', 'POST']
  }
};
