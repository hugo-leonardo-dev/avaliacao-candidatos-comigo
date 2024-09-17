import request from 'supertest';
import { app } from '../src/index';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjU1NzAxMywiZXhwIjoxNzI2NTYwNjEzfQ.5ZJZztjtt44kSWceL_wncdFD3EqCZ_BDJyOAmwmFMGM';

describe('POST /tickets', () => {
  it('should create a new ticket and return 201', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        tipo: 'suporte',
        motivo: 'upgrade',
        descricao: 'Descrição de teste',
        clienteId: 1,
        veiculo: 'Veículo de teste',
        dataAbertura: new Date().toISOString(),
        prazo: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        status: 'a_fazer'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 for invalid ticket data', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        tipo: 'invalid_type', // Valor inválido
        motivo: 'upgrade',
        descricao: 'Descrição de teste',
        clienteId: 1,
        veiculo: 'Veículo de teste',
        dataAbertura: new Date().toISOString(),
        prazo: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        status: 'a_fazer'
      });

    expect(response.status).toBe(400);
  });
});
