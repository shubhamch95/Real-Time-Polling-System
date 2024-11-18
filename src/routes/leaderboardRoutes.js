// src/routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Get leaderboard for a specific poll
router.get('/poll/:pollId', leaderboardController.getLeaderboard);

// Get detailed stats for a specific poll
router.get('/stats/:pollId', leaderboardController.getPollStats);

// Get top polls
router.get('/top-polls', leaderboardController.getTopPolls);

module.exports = router;