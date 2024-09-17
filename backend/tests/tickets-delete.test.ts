import request from 'supertest';
import { app } from '../src/index';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjU1NzAxMywiZXhwIjoxNzI2NTYwNjEzfQ.5ZJZztjtt44kSWceL_wncdFD3EqCZ_BDJyOAmwmFMGM';

describe('DELETE /tickets/:id', () => {
  it('should delete a ticket and return 204', async () => {
    const response = await request(app)
      .delete('/tickets/62') 
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existing ticket', async () => {
    const response = await request(app)
      .delete('/tickets/9999') 
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(404); // Espera-se um status 404 para ticket não encontrado
  });
});

