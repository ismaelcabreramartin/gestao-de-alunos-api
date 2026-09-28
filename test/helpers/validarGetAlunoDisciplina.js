import { api } from './api.js';
import { expect } from 'chai';

export async function getAlunoDisciplina(alunoId, alunoDisciplinaId, token) {
  const alunoDisciplinaResposta = await api()
    .get(`/api/admin/disciplinas/${alunoDisciplinaId}/alunos`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

    if (alunoDisciplinaResposta.status === 404) {
        expect(alunoDisciplinaResposta.status).to.equal(404);
    } else if (alunoDisciplinaResposta.status === 200) {
        expect(alunoDisciplinaResposta.status).to.equal(200);
        expect(alunoDisciplinaResposta.body.alunoId).to.equal(alunoId);
    } else {
        throw new Error(`Unexpected status code: ${alunoDisciplinaResposta.status}`);
    }
    

  return alunoDisciplinaResposta;
}