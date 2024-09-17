import request from 'supertest';
import { app } from '../src/index';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjU1NzAxMywiZXhwIjoxNzI2NTYwNjEzfQ.5ZJZztjtt44kSWceL_wncdFD3EqCZ_BDJyOAmwmFMGM';

describe('PUT /tickets/:id', () => {
  it('should update a ticket and return 200', async () => {
    const response = await request(app)
      .put('/tickets/61')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        tipo: 'suporte',
        motivo: 'upgrade',
        descricao: 'Descrição atualizada',
        clienteId: 1,
        veiculo: 'Veículo Atualizado',
        dataAbertura: new Date().toISOString(),
        prazo: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        status: 'em_andamento'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 61);
  });

  it('should return 400 for invalid ticket data', async () => {
    const response = await request(app)
      .put('/tickets/61')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        tipo: '', 
        motivo: 'upgrade',
        descricao: 'Descrição atualizada',
        clienteId: 1,
        veiculo: 'Veículo Atualizado',
        dataAbertura: new Date().toISOString(),
        prazo: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        status: 'em_andamento'
      });

    expect(response.status).toBe(400);
  });
});
