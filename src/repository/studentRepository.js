import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if (students.has(id)) {
        return false
    }
    students.set(id, new Student(id, name, password));
    return true
}

export const findStudent = (id) => students.get(id)

export const deleteStudent = (id) => {
    const student = students.get(id)
    if (student) {
        students.delete(id)
        return student
    }
}

export const updateStudent = (id, data) => {
    const student = students.get(id)
    if (student) {
        Object.assign(student, data)
        return student
    }
}
