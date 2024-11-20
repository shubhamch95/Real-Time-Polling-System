const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Route to get the leaderboard for a specific poll
router.get('/:pollId?', leaderboardController.getLeaderboard);

// Route to get the leaderboard for a specific option within a poll
router.get('/:pollId/option/:optionId', leaderboardController.getLeaderboardForOption);


module.exports = router;

