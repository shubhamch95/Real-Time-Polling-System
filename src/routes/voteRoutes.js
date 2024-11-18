const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Define the route for casting a vote
router.post('/vote/:optionId', voteController.castVote);

module.exports = router;
