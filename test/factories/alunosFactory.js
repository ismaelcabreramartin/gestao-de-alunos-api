import { faker } from '@faker-js/faker';

export function novoAluno() {
    const timestamp = Date.now();
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();

    return  {
                nome: faker.person.fullName(),
                email: `${firstName}.${lastName}.${timestamp}@example.com`,
                matricula: `${timestamp}`,
                senha: faker.string.alpha({ length: 6 })
        };
}