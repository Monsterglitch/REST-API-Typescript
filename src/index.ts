// Importing Libraries
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';

// Setting up application and db
dotenv.config();
const app = express();
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
}));
const dbclient = new MongoClient(process.env.MONGO_URI)

// Initialising the http server
const server = http.createServer(app);
async function run() {
    try {
        await dbclient.connect();
        const db = dbclient.db('database1');
        app.use((req, res, next) => {
            req.app.locals.db = db;
            next();
        });
        app.use('/employee', require('../routes/employee'));
        console.log("WORK AAGUTHU");
    } catch (error) {
        console.log("WORK AAGALA");
    }
}
server.listen(3000, () => {
    run();
    console.log("🚀 less gooo ..");
})