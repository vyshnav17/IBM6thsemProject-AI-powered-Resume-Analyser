import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import builderRoutes from './routes/builderRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BUILDER_PORT || 5005;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ service: 'builder-service', status: 'healthy' });
});

// Routes
app.use('/', builderRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB (Builder Service)');
        app.listen(PORT, () => {
            console.log(`Builder Service is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
