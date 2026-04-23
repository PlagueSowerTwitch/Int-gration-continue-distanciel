// backend/src/__tests__/health.test.js
const request = require('supertest');

// Mock de la DB pour les tests
jest.mock('../db', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
  },
  connectDB: jest.fn().mockResolvedValue(),
}));

const app = require('../index');

describe('GET /health', () => {
  it('devrait retourner 200 avec status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('services');
    expect(res.body.services.api).toBe('up');
  });
});

describe('POST /api/auth/register', () => {
  it('devrait rejeter si email manquant', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'test123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('devrait rejeter si mot de passe trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Routes non trouvées', () => {
  it('devrait retourner 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
