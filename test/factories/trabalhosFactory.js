import { faker } from '@faker-js/faker';

export function novoTrabalho(disciplinaId) {
    const timestamp = Date.now();
    const tituloDescricao = faker.lorem.sentence(5);

    return  {
        disciplinaId: disciplinaId,
        titulo: `${tituloDescricao}-${timestamp}`,
        descricao: tituloDescricao
    };
}
    