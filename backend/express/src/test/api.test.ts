import request from 'supertest';
import express from 'express';
import { setupSession } from '../middleware/session.js';
import apiRoutes from '../routes/api.js';

const app = express();
app.use(express.json());
app.use(setupSession());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  describe('Auth endpoints', () => {
    it('should allow login with just a username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ name: 'testuser' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('name');
    });

    it('should handle missing username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
