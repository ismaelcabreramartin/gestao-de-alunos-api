import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { getAluno } from '../helpers/validarGetAluno.js';
import { novoAluno } from '../factories/alunosFactory.js';


describe('Fluxo Cadastro Alunos', () => {
    
    it('Testes integrados chamando os endpoints de aluno', async () => {
        let alunoId;
        let alunoCadastrado = novoAluno(); // Armazena o objeto do aluno cadastrado para validação posterior;

        // cadastrar o aluno
        const cadastrarAluno = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send(alunoCadastrado);

        alunoId = cadastrarAluno.body.id;

        console.log('cadastrarAluno.body:', cadastrarAluno.body); // Adicione este log para inspecionar a resposta

        // validar que foi cadastrado com sucesso
        expect(cadastrarAluno.status).to.equal(201);

        // validar que o dado existe na base de dados
        const buscarAluno = await getAluno(alunoId, alunoCadastrado, await getTokenAdmin());

        console.log('buscarAluno.body:', buscarAluno.body); // Adicione este log para inspecionar a resposta

        // fazer uma mudança no aluno cadastrado para testar a atualização
        const atualizarAluno = await api()
            .put(`/api/admin/alunos/${alunoId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin())
            .send({ ...alunoCadastrado, nome: 'Ana Atualizada' });
        
        console.log('atualizarAluno.body:', atualizarAluno.body); // Adicione este log para inspecionar a resposta
        expect(atualizarAluno.status).to.equal(200);
        alunoCadastrado.nome = 'Ana Atualizada'; // Atualizar o nome no objeto para a validação

        // validar que o dado foi alterado com sucesso na base de dados
        const validaAtualizarAluno = await getAluno(alunoId, alunoCadastrado, await getTokenAdmin());

        console.log('validaAtualizarAluno.body:', validaAtualizarAluno.body); // Adicione este log para inspecionar a resposta

        // deletar o aluno cadastrado
        const deletarAluno = await api()
            .delete(`/api/admin/alunos/${alunoId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getTokenAdmin());

        expect(deletarAluno.status).to.equal(204);

        console.log('Aluno deletado com sucesso.'); // Adicione este log para confirmar a exclusão

        // validar que o dado não existe mais na base de dados
        const buscarAlunoDeletado = await getAluno(alunoId, alunoCadastrado, await getTokenAdmin());
        
        console.log('buscarAlunoDeletado.status:', buscarAlunoDeletado.status); // Adicione este log para inspecionar a resposta

        
    });

});    