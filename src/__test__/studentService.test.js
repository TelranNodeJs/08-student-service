import { jest } from '@jest/globals';

jest.unstable_mockModule('../repository/studentRepository.js', () => ({
    findStudentById: jest.fn(),
    createStudent: jest.fn(),
    deleteStudentById: jest.fn(),
    updateStudent: jest.fn(),
    updateStudentScore: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn(),
}));

const repo = await import ('../repository/studentRepository.js');
const service = await import ( '../services/studentService.js');

describe('studentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addStudent', () => {
        it('should add a student if not exists', async () => {
            repo.findStudentById.mockResolvedValue(null);
            repo.createStudent.mockResolvedValue({ _id: '1', name: 'Alex', password: '123' });

            const result = await service.addStudent({ id: '1', name: 'Alex', password: '123' });

            expect(repo.findStudentById).toHaveBeenCalledWith('1');
            expect(repo.createStudent).toHaveBeenCalledWith({ _id: '1', name: 'Alex', password: '123' });
            expect(result).toBe(true);
        });

        it('should not add a student if already exists', async () => {
            repo.findStudentById.mockResolvedValue({ _id: '1', name: 'Alex', password: '123' });

            const result = await service.addStudent({ id: '1', name: 'Alex', password: '123' });

            expect(repo.findStudentById).toHaveBeenCalledWith('1');
            expect(repo.createStudent).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('findStudent', () => {
        it('should return student without password', async () => {
            repo.findStudentById.mockResolvedValue({ _id: '1', name: 'Alex', password: '123' });

            const result = await service.findStudent('1');

            expect(result).toEqual({ _id: '1', name: 'Alex', password: undefined });
        });

        it('should return null if student not found', async () => {
            repo.findStudentById.mockResolvedValue(null);

            const result = await service.findStudent('1');

            expect(result).toBeNull();
        });
    });

    describe('deleteStudent', () => {
        it('should delete and return student without password', async () => {
            repo.deleteStudentById.mockResolvedValue({ _id: '1', name: 'Alex', password: '123' });

            const result = await service.deleteStudent('1');

            expect(repo.deleteStudentById).toHaveBeenCalledWith('1');
            expect(result).toEqual({ _id: '1', name: 'Alex', password: undefined });
        });

        it('should return null if student not found', async () => {
            repo.deleteStudentById.mockResolvedValue(null);

            const result = await service.deleteStudent('1');

            expect(result).toBeNull();
        });
    });

    describe('updateStudent', () => {
        it('should update student and remove scores', async () => {
            repo.updateStudent.mockResolvedValue({ _id: '1', name: 'Alex', scores: [1, 2] });

            const result = await service.updateStudent('1', { name: 'Alex' });

            expect(repo.updateStudent).toHaveBeenCalledWith('1', { name: 'Alex' });
            expect(result).toEqual({ _id: '1', name: 'Alex', scores: undefined });
        });

        it('should return null if not found', async () => {
            repo.updateStudent.mockResolvedValue(null);

            const result = await service.updateStudent('1', { name: 'Alex' });

            expect(result).toBeNull();
        });
    });

    describe('addScore', () => {
        it('should add score', async () => {
            repo.updateStudentScore.mockResolvedValue({ _id: '1', name: 'Alex', scores: [90] });

            const result = await service.addScore('1', 'math', 90);

            expect(repo.updateStudentScore).toHaveBeenCalledWith('1', 'math', 90);
            expect(result).toEqual({ _id: '1', name: 'Alex', scores: [90] });
        });
    });

    describe('findByName', () => {
        it('should return students without passwords', async () => {
            repo.findStudentsByName.mockResolvedValue([
                { _id: '1', name: 'Alex', password: '123' },
                { _id: '2', name: 'Alex', password: '234' },
            ]);

            const result = await service.findByName('Alex');

            expect(result).toEqual([
                { _id: '1', name: 'Alex', password: undefined },
                { _id: '2', name: 'Alex', password: undefined },
            ]);
        });
    });

    describe('countByNames', () => {
        it('should count students by names', async () => {
            repo.countStudentsByNames.mockResolvedValue(2);

            const result = await service.countByNames(['Alex', 'Ivan']);

            expect(repo.countStudentsByNames).toHaveBeenCalledWith(['Alex', 'Ivan']);
            expect(result).toBe(2);
        });
    });

    describe('findByMinScore', () => {
        it('should return students without passwords', async () => {
            repo.findStudentsByMinScore.mockResolvedValue([
                { _id: '1', name: 'Alex', password: '123' },
                { _id: '2', name: 'Ivan', password: '234' },
            ]);

            const result = await service.findByMinScore('math', 80);

            expect(repo.findStudentsByMinScore).toHaveBeenCalledWith('math', 80);
            expect(result).toEqual([
                { _id: '1', name: 'Alex', password: undefined },
                { _id: '2', name: 'Ivan', password: undefined },
            ]);
        });
    });
});
