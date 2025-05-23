// tests/studentRoutes.test.js
import request from 'supertest';

jest.mock('../src/controller/studentController.js', () => ({
    addStudent: (req, res) => res.status(201).json({ message: 'Student added' }),
    findStudent: (req, res) => res.status(200).json({ id: req.params.id }),
    deleteStudent: (req, res) => res.status(200).json({ message: 'Student deleted' }),
    updateStudent: (req, res) => res.status(200).json({ message: 'Student updated' }),
    addScore: (req, res) => res.status(200).json({ message: 'Score added' }),
    findByName: (req, res) => res.status(200).json({ name: req.params.name }),
    countByNames: (req, res) => res.status(200).json({ count: 5 }),
    findByMinScore: (req, res) =>
        res.status(200).json({ exam: req.params.exam, minScore: req.params.minScore })
}));

describe('Student Routes', () => {
    test('POST /api/student should call addStudent', async () => {
        const res = await request(app).post('/api/student').send({ id: 1, name: 'Alice' });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Student added');
    });

    test('GET /api/student/:id should call findStudent', async () => {
        const res = await request(app).get('/api/student/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe('1');
    });

    test('DELETE /api/student/:id should call deleteStudent', async () => {
        const res = await request(app).delete('/api/student/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Student deleted');
    });

    test('PATCH /api/student/:id should call updateStudent', async () => {
        const res = await request(app).patch('/api/student/1').send({ name: 'Bob' });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Student updated');
    });

    test('PATCH /api/score/student/:id should call addScore', async () => {
        const res = await request(app).patch('/api/score/student/1').send({ exam: 'math', score: 90 });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Score added');
    });

    test('GET /api/students/name/:name should call findByName', async () => {
        const res = await request(app).get('/api/students/name/Alice');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Alice');
    });

    test('GET /api/quantity/students should call countByNames', async () => {
        const res = await request(app).get('/api/quantity/students');
        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(5);
    });

    test('GET /api/students/exam/:exam/minscore/:minScore should call findByMinScore', async () => {
        const res = await request(app).get('/api/students/exam/math/minscore/75');
        expect(res.statusCode).toBe(200);
        expect(res.body.exam).toBe('math');
        expect(res.body.minScore).toBe('75');
    });
});
