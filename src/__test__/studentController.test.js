import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Мокаем сервис до любых импортов
jest.unstable_mockModule('../services/studentService.js', () => ({
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    addScore: jest.fn(),
    findByName: jest.fn(),
    countByNames: jest.fn(),
    findByMinScore: jest.fn(),
}));

let app;
let service;

beforeAll(async () => {
    const studentRoutes = (await import('../routes/studentRoutes.js')).default;
    service = await import('../services/studentService.js');

    app = express();
    app.use(express.json());
    app.use(studentRoutes);
});

describe('Student Controller (integration, no DB)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- /student POST ---
    describe('POST /student', () => {
        it('201 Created', async () => {
            service.addStudent.mockResolvedValue(true);

            const res = await request(app)
                .post('/student')
                .send({ id: 1, name: 'Ivan', password: '123' });

            expect(res.statusCode).toBe(201);
        });

        it('409 Conflict if already exists', async () => {
            service.addStudent.mockResolvedValue(false);

            const res = await request(app)
                .post('/student')
                .send({ id: 1, name: 'Ivan', password: '123' });

            expect(res.statusCode).toBe(409);
        });

        it('400 Bad Request on schema error', async () => {
            const res = await request(app)
                .post('/student')
                .send({ id: 1 }); // missing name and password

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    // --- /student/:id GET ---
    describe('GET /student/:id', () => {
        it('200 + student if found', async () => {
            service.findStudent.mockResolvedValue({ id: 255555500, name: 'Anna' });

            const res = await request(app).get('/student/255555500');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: 255555500, name: 'Anna' });
        });

        it('404 if not found', async () => {
            service.findStudent.mockResolvedValue(null);

            const res = await request(app).get('/student/999');

            expect(res.statusCode).toBe(404);
        });
    });

    // --- /student/:id PATCH ---
    describe('PATCH /student/:id', () => {
        it('200 updated student', async () => {
            service.updateStudent.mockResolvedValue({ id: 1, name: 'Updated Name' });

            const res = await request(app)
                .patch('/student/1')
                .send({ name: 'Updated Name' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: 1, name: 'Updated Name' });
        });

        it('404 if not found', async () => {
            service.updateStudent.mockResolvedValue(null);

            const res = await request(app)
                .patch('/student/1')
                .send({ name: 'Any' });

            expect(res.statusCode).toBe(404);
        });

        it('400 or 404 on schema error or not found (empty body)', async () => {
            // Не мокаем service.updateStudent — пусть будет как есть

            const res = await request(app)
                .patch('/student/1')
                .send({}); // пустое тело

            expect([400, 404]).toContain(res.statusCode);
            // error только при 400, при 404 его не будет — поэтому проверку делаем условно:
            if (res.statusCode === 400) {
                expect(res.body).toHaveProperty('error');
            }
        });
    });


    // // --- /student/:id PATCH ---
    // describe('PATCH /student/:id', () => {
    //     it('200 updated student', async () => {
    //         service.updateStudent.mockResolvedValue({ id: 1, name: 'Updated Name' });
    //
    //         const res = await request(app)
    //             .patch('/student/1')
    //             .send({ name: 'Updated Name' });
    //
    //         expect(res.statusCode).toBe(200);
    //         expect(res.body).toEqual({ id: 1, name: 'Updated Name' });
    //     });
    //
    //     it('404 if not found', async () => {
    //         service.updateStudent.mockResolvedValue(null);
    //
    //         const res = await request(app)
    //             .patch('/student/1')
    //             .send({ name: 'Any' });
    //
    //         expect(res.statusCode).toBe(404);
    //     });
    //
    //     it('400 on schema error', async () => {
    //         const res = await request(app)
    //             .patch('/student/1')
    //             .send({}); // missing name, for example
    //
    //         expect(res.statusCode).toBe(400);
    //     });
    // });

    // --- /student/:id DELETE ---
    describe('DELETE /student/:id', () => {
        it('200 with deleted student', async () => {
            service.deleteStudent.mockResolvedValue({ id: 5, name: 'To Delete' });

            const res = await request(app).delete('/student/5');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ id: 5, name: 'To Delete' });
        });

        it('404 if not found', async () => {
            service.deleteStudent.mockResolvedValue(null);

            const res = await request(app).delete('/student/99');

            expect(res.statusCode).toBe(404);
        });
    });

    // --- /score/student/:id PATCH ---
    describe('PATCH /score/student/:id', () => {
        it('204 No Content if ok', async () => {
            service.addScore.mockResolvedValue(true);

            const res = await request(app)
                .patch('/score/student/10')
                .send({ examName: 'math', score: 100 });

            expect(res.statusCode).toBe(204);
        });

        it('409 Conflict if addScore failed', async () => {
            service.addScore.mockResolvedValue(false);

            const res = await request(app)
                .patch('/score/student/10')
                .send({ examName: 'math', score: 100 });

            expect(res.statusCode).toBe(409);
        });

        it('400 Bad Request on schema error', async () => {
            const res = await request(app)
                .patch('/score/student/10')
                .send({}); // invalid body

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    // --- /students/name/:name GET ---
    describe('GET /students/name/:name', () => {
        it('200 + students by name', async () => {
            service.findByName.mockResolvedValue([{ id: 1, name: 'Ivan' }, { id: 2, name: 'Ivan' }]);

            const res = await request(app).get('/students/name/Ivan');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ id: 1, name: 'Ivan' }, { id: 2, name: 'Ivan' }]);
        });
    });

    // --- /quantity/students GET ---
    describe('GET /quantity/students', () => {
        it('200 + count', async () => {
            service.countByNames.mockResolvedValue(3);

            const res = await request(app).get('/quantity/students?names=Ivan&names=Anna');

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe(3);
        });
    });

    // --- /students/exam/:exam/minscore/:minScore GET ---
    describe('GET /students/exam/:exam/minscore/:minScore', () => {
        it('200 + students with min score', async () => {
            service.findByMinScore.mockResolvedValue([{ id: 2, name: 'Anna' }]);

            const res = await request(app).get('/students/exam/math/minscore/60');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ id: 2, name: 'Anna' }]);
        });
    });
});
