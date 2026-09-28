import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { getAluno } from '../helpers/validarGetAluno.js';
import { getDisciplina } from '../helpers/validarGetDisciplina.js';
import { getTrabalho } from '../helpers/validarGetTrabalho.js';
import { getAlunoDisciplina } from '../helpers/validarGetAlunoDisciplina.js';
import testeDeMatriculas from '../fixtures/matriculas.json' with { type: 'json'};

/*********************************************************************************************************
*** Serão criados novos e no final dos testes os dados serão deletados para não poluir a base de dados ***
**********************************************************************************************************/

describe.only('Fluxo de Aluno em Disciplina entrega trabalho', () => {

    testeDeMatriculas.forEach((testeDeMatricula) => {
    
        it(testeDeMatricula.testTitle, async () => {
            let alunoId;
            let disciplinaId;
            let alunoDisciplinaId;
            // Armazena o objeto do aluno e disciplina cadastrados para validação posterior;
            let alunoCadastrado = testeDeMatricula.dadosAluno; 
            let disciplinaCadastrada = testeDeMatricula.dadosDisciplina;

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
            expect(cadastrarAluno.status).to.equal(testeDeMatricula.statusCodeEsperadoCriarDado);

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
            expect(cadastroDisciplinaResposta.status).to.equal(testeDeMatricula.statusCodeEsperadoCriarDado);

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
            expect(cadastroAlunoDisciplina.status).to.equal(testeDeMatricula.statusCodeEsperadoCriarDado);

            // validar que o dado existe na base de dados
            const buscarAlunoDisciplina = await getAlunoDisciplina(alunoId, alunoDisciplinaId, await getTokenAdmin());

            // Adicione este log para inspecionar a resposta
            console.log('buscarAlunoDisciplina.body:', buscarAlunoDisciplina.body); 

            // Armazena o objeto do aluno e disciplina cadastrados para validação posterior;
            let trabalhoCadastrado = testeDeMatricula.dadosTrabalho;
            
            // Adicione o ID da disciplina ao objeto do trabalho
            trabalhoCadastrado.disciplinaId = disciplinaId;

            console.log('trabalhoCadastrado verificar aqui:', trabalhoCadastrado); // Adicione este log para inspecionar o objeto do trabalho

            const registrarEntregaDeTrabalho = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await getTokenAdmin())
                .send(trabalhoCadastrado);

            let trabalhoId = registrarEntregaDeTrabalho.body.id;            

            // Adicione este log para inspecionar a resposta
            console.log('registrarEntregaDeTrabalho.body:', registrarEntregaDeTrabalho.body); 
            expect(registrarEntregaDeTrabalho.status).to.equal(testeDeMatricula.statusCodeEsperadoCriarDado);

            // validar que o dado existe na base de dados
            const buscarTrabalho = await getTrabalho(trabalhoId, alunoId, trabalhoCadastrado, await getTokenAdmin());

            // Adicione este log para inspecionar a resposta
            console.log('buscarTrabalho.body:', buscarTrabalho.body); 

            // Deleto o aluno, disciplina e trabalho para não poluir a base de dados
            const deletarAluno = await api()
            .delete(`/api/admin/alunos/${alunoId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin());

            expect(deletarAluno.status).to.equal(testeDeMatricula.statusCodeEsperadoDeletarDado);
            // Adicione este log para confirmar a exclusão
            console.log('Aluno deletado com sucesso.'); 

            const deletarDisciplina = await api()
            .delete(`/api/admin/disciplinas/${disciplinaId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin());

            expect(deletarDisciplina.status).to.equal(testeDeMatricula.statusCodeEsperadoDeletarDado);
            // Adicione este log para confirmar a exclusão
            console.log('Disciplina deletada com sucesso.'); 

            const deletarTrabalho = await api()
            .delete(`/api/admin/trabalhos/${trabalhoId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin());

            expect(deletarTrabalho.status).to.equal(testeDeMatricula.statusCodeEsperadoDeletarDado);
            // Adicione este log para confirmar a exclusão
            console.log('Trabalho deletado com sucesso.'); 
            
        });
    });
});    