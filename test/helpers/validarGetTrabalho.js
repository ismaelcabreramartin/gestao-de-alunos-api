import { api } from './api.js';
import { expect } from 'chai';

export async function getTrabalho(trabalhoId, alunoId, trabalhoCadastrado, token) {
  const trabalhoResposta = await api()
    .get(`/api/admin/trabalhos/${trabalhoId}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

    if (trabalhoResposta.status === 404) {
        expect(trabalhoResposta.status).to.equal(404);
    } else if (trabalhoResposta.status === 200) {
        expect(trabalhoResposta.status).to.equal(200);
        expect(trabalhoResposta.body.alunoId).to.equal(alunoId);
        expect(trabalhoResposta.body.disciplinaId).to.equal(trabalhoCadastrado.disciplinaId);
        expect(trabalhoResposta.body.titulo).to.equal(trabalhoCadastrado.titulo);
        expect(trabalhoResposta.body.descricao).to.equal(trabalhoCadastrado.descricao);
    } else {
        throw new Error(`Unexpected status code: ${trabalhoResposta.status}`);
    }
    

  return trabalhoResposta;
}