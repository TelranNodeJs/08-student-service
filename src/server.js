import dotenv from "dotenv";
import express from "express";
import studentRoutes from './routes/studentRoutes.js';
import {MongoClient} from "mongodb";
import {init} from './repository/studentRepository.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;
const client = new MongoClient(process.env.MONGO_URL);

app.use(express.json());
app.use(studentRoutes)

app.use((req, res) => {
    res.status(404).type('text/plain;charset=utf-8').send('Not Found');
})

async function startServer() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        init(db);
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    } catch (err) {
        console.log('Failed to connect to MongoDB.', err);
    }
}

startServer();
