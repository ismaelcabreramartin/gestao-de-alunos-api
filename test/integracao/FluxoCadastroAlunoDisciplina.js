import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { getAluno } from '../helpers/validarGetAluno.js';
import { getDisciplina } from '../helpers/validarGetDisciplina.js';
import { getTrabalho } from '../helpers/validarGetTrabalho.js';
import { getAlunoDisciplina } from '../helpers/validarGetAlunoDisciplina.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import { novoTrabalho } from '../factories/trabalhosFactory.js';


describe('Fluxo de Aluno em Disciplina entrega trabalho', () => {
    
    it('Validar que um aluno um novo aluno é cadastrado em uma disciplina e entrega o trabalho', async () => {
        let alunoId;
        let disciplinaId;
        let alunoDisciplinaId;
        // Armazena o objeto do aluno e disciplina cadastrados para validação posterior;
        let alunoCadastrado = novoAluno(); 
        let disciplinaCadastrada = novaDisciplina();

        // cadastrar o aluno
        const cadastrarAluno = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send(alunoCadastrado);

        alunoId = cadastrarAluno.body.id;

        // Adicione este log para inspecionar a resposta
        console.log('cadastrarAluno.body:', cadastrarAluno.body); 

        // validar que foi cadastrado com sucesso
        expect(cadastrarAluno.status).to.equal(201);

        // validar que o dado existe na base de dados
        const buscarAluno = await getAluno(alunoId, alunoCadastrado, await getTokenAdmin());

        // Adicione este log para inspecionar a resposta
        console.log('buscarAluno.body:', buscarAluno.body); 

        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send(disciplinaCadastrada);

        disciplinaId = cadastroDisciplinaResposta.body.id;
       
        // Adicione este log para inspecionar a resposta
        console.log('cadastroDisciplinaResposta.body:', cadastroDisciplinaResposta.body); 
        expect(cadastroDisciplinaResposta.status).to.equal(201);

        // validar que o dado existe na base de dados
        const buscarDisciplina = await getDisciplina(disciplinaId, disciplinaCadastrada, await getTokenAdmin());

        // Adicione este log para inspecionar a resposta
        console.log('buscarDisciplina.body:', buscarDisciplina.body); 

        // cadastrar aluno na disciplina 
        const cadastroAlunoDisciplina = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send({ alunoId });

        alunoDisciplinaId = cadastroAlunoDisciplina.body.id;
       
        // Adicione este log para inspecionar a resposta
        console.log('cadastroAlunoDisciplina.body:', cadastroAlunoDisciplina.body); 
        expect(cadastroAlunoDisciplina.status).to.equal(201);

        // validar que o dado existe na base de dados
        const buscarAlunoDisciplina = await getAlunoDisciplina(alunoId, alunoDisciplinaId, await getTokenAdmin());

        // Adicione este log para inspecionar a resposta
        console.log('buscarAlunoDisciplina.body:', buscarAlunoDisciplina.body); 

        // Armazena o objeto do aluno e disciplina cadastrados para validação posterior;
        let trabalhoCadastrado = novoTrabalho(disciplinaId);

        console.log('trabalhoCadastrado verificar aqui:', trabalhoCadastrado); // Adicione este log para inspecionar o objeto do trabalho

        const registrarEntregaDeTrabalho = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send(trabalhoCadastrado);

        let trabalhoId = registrarEntregaDeTrabalho.body.id;            

        // Adicione este log para inspecionar a resposta
        console.log('registrarEntregaDeTrabalho.body:', registrarEntregaDeTrabalho.body); 
        expect(registrarEntregaDeTrabalho.status).to.equal(201);

        // validar que o dado existe na base de dados
        const buscarTrabalho = await getTrabalho(trabalhoId, alunoId, trabalhoCadastrado, await getTokenAdmin());

        // Adicione este log para inspecionar a resposta
        console.log('buscarTrabalho.body:', buscarTrabalho.body); 
        
    });

});    