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

const Student = mongoose.model("Student", studentSchema, 'college');
export default Student;
// import mongoose from "mongoose";
//
// const studentSchema = new mongoose.Schema({
//     _id: {type: Number, required: true},
//     name: {type: String, required: true},
//     password: {type: String, required: true},
//     scores: {
//         // type:Object,
//         // value:number,
//         type: Map,
//         key: String,
//         of: Number,
//         default: {}
//     },
// }, {
//     versionKey: false
// })
//
// const Student = new mongoose.model(
//     "Student",
//     studentSchema,
//     'college'
// )
// export default Student;