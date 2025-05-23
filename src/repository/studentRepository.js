import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url);
let collection;

export async function connect() {
    // if(!(client.topology && client.topology.isConnected)){
    //     await client.connect();
    // }
    if (!client.topology?.isConnected()) {
        await client.connect();
    }
    const db = client.db(dbName);
    collection = db.collection('college');
}

export const addStudent = async ({id, name, password}) => {
    await connect()
    const existing = await collection.findOne({_id: id})
    if (existing) {
        return false
    }
    await collection.insertOne({_id: id, name, password, scores: {}})
    return true
}

export const findStudent = async (id) => {
    await connect()
    return await collection.findOne({_id: id})

}

export const deleteStudent = async (id) => {
    await connect()
    return await collection.findOneAndDelete({_id: id})
}

export const updateStudent = async (id, data) => {
    await connect()
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: data},
        {returnDocument: 'after'})
}

export const addScore = async (id, exam, score) => {
    await connect()
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${exam}`]: score}})
}

export const findByName = async (name) => {
    await connect()
    return await collection
        .find({ name: { $regex: `^${name}$`, $options: 'i' } })
        .toArray()
}

export const countByNames = async  (names) => {
  await connect()
    // names = names.map(name => name.toLowerCase());
    // return Array.from(students.values())
    //     .filter(s => names.includes(s.name.toLowerCase()))
    //     .length;
}

export const findByMinScore = async (exam, minScore) => {
    await connect()
    return await collection.find({
        scores: {
            $elemMatch: {
                exam: { $regex: `^${exam}$`, $options: 'i' } ,
                minscore: { $gte: minScore }
            }}
    }).toArray()
    // return Array.from(students.values())
    //     .filter(s => s.scores[exam] >= minScore);
}
