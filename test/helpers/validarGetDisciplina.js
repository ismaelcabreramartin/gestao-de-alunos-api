import { api } from './api.js';
import { expect } from 'chai';

export async function getDisciplina(disciplinaId, novaDisciplina, token) {
  const disciplinaResposta = await api()
    .get(`/api/admin/disciplinas/${disciplinaId}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

    if (disciplinaResposta.status === 404) {
        expect(disciplinaResposta.status).to.equal(404);
    } else if (disciplinaResposta.status === 200) {
        expect(disciplinaResposta.status).to.equal(200);
        expect(disciplinaResposta.body.nome).to.equal(novaDisciplina.nome);
        expect(disciplinaResposta.body.cargaHoraria).to.equal(novaDisciplina.cargaHoraria);
    } else {
        throw new Error(`Unexpected status code: ${disciplinaResposta.status}`);
    }
    

  return disciplinaResposta;
}