import dotenv from "dotenv";
import express from "express";
import studentRoutes from './routes/studentRoutes.js';
import mongoose from "mongoose";

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(studentRoutes)

app.use((req, res) => {
    res.status(404).type('text/plain;charset=utf-8').send('Not Found');
})

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI,
            {
                dbName: process.env.DB_NAME,
            })
        console.log("Connected to MongoDB")
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    } catch (err) {
        console.log('Failed to connect to MongoDB.', err);
    }
}

startServer();
