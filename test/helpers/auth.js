import { api } from './api.js';
import 'dotenv/config';

let tokenEmCache = null;

export async function getTokenAdmin() {
  if (!tokenEmCache) {
    const loginResposta = await api()
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
          email: process.env.ADMIN_USER,
          senha: process.env.ADMIN_SENHA
      });

    tokenEmCache = loginResposta.body.token;
  }

  return `Bearer ${tokenEmCache}`;
}