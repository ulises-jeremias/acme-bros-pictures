import request from 'supertest';
import app from '../../src/server';

describe('basic route tests', () => {
    test('get index route GET /', async () => {
        const response = await request(app.callback()).get('/api/v1');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Welcome to ACME BROS Pictures API');
    });
    test('test errorHandler', async () => {
        const response = await request(app.callback()).post('/');
        expect(response.status).toBe(404);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
    });
});