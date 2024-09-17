import request from 'supertest';
import { app } from '../src/index'; 

describe('POST /login', () => {
    it('should return a token and role for valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ login: 'admin', password: 'admin123' }); 
  
      console.log('Response:', response.body); 
  
      expect(response.status).toBe(200);
  
      expect(response.body).toHaveProperty('token');
      
      expect(response.body).toHaveProperty('role');
      
      expect(response.body.role).toBe('admin');
  
      expect(typeof response.body.token).toBe('string');
    });
  
    it('should return 400 for missing login or password', async () => {
      const response = await request(app)
        .post('/login')
        .send({ login: 'admin' }); 
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro', 'Login e senha são necessários.');
    });
  
    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ login: 'admin', password: 'wrongpassword' });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('erro', 'Credenciais inválidas');
    });
  });
