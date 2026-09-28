import request  from 'supertest';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function api() {
    return request(process.env.BASE_URL);
}