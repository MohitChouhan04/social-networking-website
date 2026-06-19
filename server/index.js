const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
const app = express();

const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/api', router);

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set. Add it in Render environment variables.");
        }

        await connectDB();
        app.listen(port, () => {
            console.log(`App is listening on port: ${port}`);
        });
    } catch (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
};

startServer();


