import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import connectDB from './database/connection.js';
import { createAdminUser } from './utils/seeder.js';


// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import taskRoutes from './routes/tasks.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'DevTrack API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth/login',
            admin_dashboard: '/api/admin/dashboard',
            tasks: '/api/tasks',
            profile: '/api/auth/profile'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`.bgBlue);

    // Create admin user if it doesn't exist
    await createAdminUser();
});