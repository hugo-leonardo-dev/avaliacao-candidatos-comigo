import { JwtPayload as OriginalJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends OriginalJwtPayload {
  userId: number;
  email: string;
  role: string;
  // Adicione outros campos conforme necessário
}