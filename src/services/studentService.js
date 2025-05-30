import * as repo from '../repository/studentRepository.js'

export const addStudent = async ({id, name, password}) => {
    const existing = await repo.findStudentById(id);
    if (existing) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) => {
    const student = await repo.findStudentById(id);
    if (student) {
        student.password = undefined;
    }
    return student;
}

export const deleteStudent = async (id) => {
    const student = await repo.deleteStudentById(id);
    if (student) {
        student.password = undefined;
    }
    return student;
}

export const updateStudent = async (id, data) => {
    const student = await repo.updateStudent(id, data);
    if (student) {
        student.scores = undefined;
    }
    return student;
}

export const addScore = async (id, exam, score) => {
    return await repo.updateStudentScore(id, exam, score);
}

export const findByName = async (name) => {
    const students = await repo.findStudentsByName(name);
    return students.map(student => {
        student.password = undefined;
        return student;
    });
}

export const countByNames = async (names) => {
    return await repo.countStudentsByNames(names);
}

export const findByMinScore = async (exam, minScore) => {
    const students = await repo.findStudentsByMinScore(exam, minScore);
    return students.map(student => {
        student.password = undefined;
        return student;
    });
}
// import * as repo from '../repository/studentRepository.js'
//
// export const addStudent = async ({id, name, password}) => {
//     const existing = await repo.findStudentById(id)
//     if (existing) {
//         return false
//     }
//     await repo.createStudent({_id: id, name, password})
//     return true
// }
//
// export const findStudent = async (id) => {
//     return await repo.findStudentById(id)
//
// }
//
// export const deleteStudent = async (id) => {
//     return await repo.deleteStudent(id)
// }
//
// export const updateStudent = async (id, data) => {
//     return await repo.updateStudent(id, data)
// }
//
// export const addScore = async (id, exam, score) => {
//     return await repo.updateStudentScore(id, exam, score)
// }
//
// export const findByName = async (name) => {
//     return await repo.findStudentsByName(name)
// }
// export const countByNames = async (names) => {
//     return await repo.countStudentsByNames(names)
// }
//
// export const findByMinScore = async (exam, minScore) => {
//     return await repo.findStudentsByMinScore(exam, minScore)
// }
