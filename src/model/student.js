import mongoose from "mongoose";

const  studentSchema = new mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    scores: {
        // type:Object,
        // value:number,
        type: Map,
        key: String,
        of: Number,
        default: {}
    },
})

const Student = new mongoose.model(
    "Student",
    studentSchema,
    'college'
)
export default Student;