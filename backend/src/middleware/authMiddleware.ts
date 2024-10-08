import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = 'senha'; 

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token == null) return res.status(401).json({ erro: 'Token de autenticação inválido ou ausente' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ erro: 'Token de autenticação inválido ou ausente' });

    (req as any).user = user; 
    next();
  });
};
