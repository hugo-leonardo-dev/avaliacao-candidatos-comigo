import request from 'supertest';
import { app } from '../src/index';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjU1NzAxMywiZXhwIjoxNzI2NTYwNjEzfQ.5ZJZztjtt44kSWceL_wncdFD3EqCZ_BDJyOAmwmFMGM';

describe('GET /clientes', () => {
  it('should return a list of clients', async () => {
    const response = await request(app)
      .get('/clientes')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 401 for unauthorized requests', async () => {
    const response = await request(app)
      .get('/clientes');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('erro', 'Token de autenticação inválido ou ausente');
  });
});
