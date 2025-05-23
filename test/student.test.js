import {Student} from "../src/model/student.js";

describe('Student class', () => {
    test('should create a Student instance with given properties', () => {
        const id = 1;
        const name = 'Alice';
        const password = 'securePassword123';

        const student = new Student(id, name, password);

        expect(student).toBeInstanceOf(Student);
        expect(student.id).toBe(id);
        expect(student.name).toBe(name);
        expect(student.password).toBe(password);
        expect(student.scores).toEqual({});
    });
});