const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('API Root Endpoint', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return welcome message', async () => {
        const res = await request(app).get('/api');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Welcome to the API');
    });
});
