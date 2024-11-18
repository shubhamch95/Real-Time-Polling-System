require('dotenv').config();
const express = require('express');
const http = require('http');
const { sequelize } = require('./src/config/database');
const pollRoutes = require('./src/routes/pollRoutes');
const voteRoutes = require('./src/routes/voteRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const { syncModels } = require('./src/models');
const kafkaService = require('./src/services/kafkaService');
const websocketService = require('./src/services/websocketService');  // Add this import


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/polls', pollRoutes);
app.use('/api/v1/vote', voteRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Create and start the server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database.');

        await syncModels();
        console.log('Database models synchronized.');

        await kafkaService.initialize();
        console.log('Kafka initialized.');

        const server = http.createServer(app);

        // Add WebSocket initialization here
        websocketService.initialize(server);
        console.log('WebSocket server initialized.');

        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
