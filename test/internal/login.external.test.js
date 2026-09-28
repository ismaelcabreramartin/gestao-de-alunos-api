import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import { expect } from 'chai';
import { JWT_SECRET } from '../../src/config/jwt.js';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('Login', () => {

  it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
    const authServiceMock = sinon.stub(authService, 'login');
    authServiceMock.throws(new Error('ERRO CATASTRÓFICOOOOO!!!'));

    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com',
        senha: 'admin123'
      });

    expect(loginResposta.status).to.equal(500);

    sinon.restore();
  });

  describe('Sucesso (200)', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'admin123' });

      expect(loginResposta.status).to.equal(200);

      expect([200, 201, 202]).to.include(loginResposta.status);
    });

    it('deve retornar o token e os dados do administrador ao logar com sucesso', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'admin123' });

      expect(loginResposta.body).to.have.property('token').that.is.a('string');
      expect(loginResposta.body).to.have.property('usuario');
      expect(loginResposta.body.usuario).to.include({
        id: 'admin-principal',
        nome: 'Administrador do Sistema',
        email: 'admin@escola.com',
        role: 'admin',
      });
      expect(loginResposta.body.usuario).to.not.have.property('senha');
    });

    it('deve permitir login de um aluno cadastrado', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'ana.souza@example.com', 'senha': '123456' });

      expect(loginResposta.status).to.equal(200);
      expect(loginResposta.body.usuario).to.include({
        id: 'aluno-ana-souza',
        email: 'ana.souza@example.com',
        role: 'aluno',
      });
    });

    it('deve retornar um token JWT válido, assinado e com os claims esperados', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'admin123' });

      const { token } = loginResposta.body;
      expect(token.split('.')).to.have.lengthOf(3);

      const payload = jwt.verify(token, JWT_SECRET);
      expect(payload).to.include({
        sub: 'admin-principal',
        role: 'admin',
        nome: 'Administrador do Sistema',
      });
      expect(payload).to.have.property('exp');
      expect(payload).to.have.property('iat');
      expect(payload.exp - payload.iat).to.equal(8 * 60 * 60);
    });

    it('deve ignorar campos extras enviados no corpo da requisição', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'admin123', 'campoExtra': 'qualquerCoisa' });

      expect(loginResposta.status).to.equal(200);
    });
  });

  describe('Erros de validação (400)', () => {
    it('deve retornar 400 quando a senha for vazia', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': '' });

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando o email for vazio', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': '', 'senha': 'admin123' });

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando email e senha forem vazios', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': '', 'senha': '' });

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando o campo email não for enviado', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'senha': 'admin123' });

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando o campo senha não for enviado', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com' });

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando o corpo da requisição estiver vazio', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({});

      expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar a mensagem de erro correta quando os campos obrigatórios faltarem', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com' });

      expect(loginResposta.body).to.have.property('error', 'Os campos "email" e "senha" são obrigatórios.');
      expect(loginResposta.body).to.not.have.property('token');
    });
  });

  describe('Erros de autenticação (401)', () => {
    it('deve retornar 401 quando o usuário ou senha estiverem incorretos', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'admin123456' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando o email não estiver cadastrado', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'naoexiste@escola.com', 'senha': 'qualquerSenha' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando o email não estiver cadastrado mesmo usando a senha correta de outro aluno', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'naoexiste@example.com', 'senha': '123456' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando a senha de um aluno estiver incorreta', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'ana.souza@example.com', 'senha': 'senhaErrada' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando o email existir com diferença de maiúsculas/minúsculas', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'ADMIN@escola.com', 'senha': 'admin123' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando a senha contiver apenas espaços em branco', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': '   ' });

      expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar a mensagem de erro correta quando as credenciais forem inválidas', async () => {
      const loginResposta = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 'email': 'admin@escola.com', 'senha': 'senhaErrada' });

      expect(loginResposta.body).to.have.property('error', 'E-mail ou senha inválidos.');
      expect(loginResposta.body).to.not.have.property('token');
    });
  });
});
