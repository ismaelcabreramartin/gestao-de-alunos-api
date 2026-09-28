import request  from 'supertest';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';


describe('Alunos', () => {
    let token;

    beforeEach(async () => {
        // obter o token
        token = await getTokenAdmin();
    });
    
    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        
        // objeto com os dados do novo aluno
        const novoAluno = {
            nome: 'Ana Deletar',
            email: 'ana.deletar@example.com',
            matricula: '2026003',
            senha: '123456'
        };

        // cadastrar o aluno
        const cadastrarAluno = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(novoAluno);

        // validar que foi cadastrado com sucesso
        expect(cadastrarAluno.status).to.equal(201);
        expect(cadastrarAluno.body.nome).to.equal(novoAluno.nome);
        expect(cadastrarAluno.body.email).to.equal(novoAluno.email);
        expect(cadastrarAluno.body.matricula).to.equal(novoAluno.matricula);

        // deletar o aluno cadastrado
        const alunoId = cadastrarAluno.body.id;
        const deletarAluno = await request('http://localhost:3000')
            .delete(`/api/admin/alunos/${alunoId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token);

        expect(deletarAluno.status).to.equal(204);
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        
        // objeto com os dados do novo aluno
        const novoAluno = {
            nome: 'Ana Souza',
            email: 'ana.souza@example.com',
            matricula: '2026001',
            senha: '123456'
        };

        // cadastrar o aluno
        const cadastrarAluno = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(novoAluno);

        // validar que foi cadastrado com sucesso
        expect(cadastrarAluno.status).to.equal(409);
        expect(cadastrarAluno.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });

});    