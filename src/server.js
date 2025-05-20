import dotenv from "dotenv";
import express from "express";
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(studentRoutes)

app.use((req, res) => {
    res.status(404).type('text/plain;charset=utf-8').send('Not Found');
})
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
