import { api } from './api.js';
import { expect } from 'chai';

export async function getAluno(alunoId, novoAluno, token) {
  const alunoResposta = await api()
    .get(`/api/admin/alunos/${alunoId}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

    if (alunoResposta.status === 404) {
        expect(alunoResposta.status).to.equal(404);
    } else if (alunoResposta.status === 200) {
        expect(alunoResposta.status).to.equal(200);
        expect(alunoResposta.body.nome).to.equal(novoAluno.nome);
        expect(alunoResposta.body.email).to.equal(novoAluno.email);
        expect(alunoResposta.body.matricula).to.equal(novoAluno.matricula);
    } else {
        throw new Error(`Unexpected status code: ${alunoResposta.status}`);
    }
    

  return alunoResposta;
}