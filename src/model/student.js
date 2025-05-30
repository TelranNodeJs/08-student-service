import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    scores: {
        type: Map,
        key: String,
        of: Number,
        default: {}
    }
}, {
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})
// .min(1); // <-- запрещает пустой объект
// Лучше всего добавить .min(1) к Joi схеме обновления (updateStudentSchema) —
// тогда пустые PATCH запросы будут отклоняться валидатором.

const Student = mongoose.model("Student", studentSchema, process.env.COLLECTION_NAME || "students");
export default Student;
