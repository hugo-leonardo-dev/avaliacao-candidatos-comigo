import request from 'supertest';
import { app } from '../src/index';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjU1NzAxMywiZXhwIjoxNzI2NTYwNjEzfQ.5ZJZztjtt44kSWceL_wncdFD3EqCZ_BDJyOAmwmFMGM';

describe('GET /tickets', () => {
  it('should return a list of tickets', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});