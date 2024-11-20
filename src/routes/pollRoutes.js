const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// Route for creating a new poll
router.post('/createPoll', pollController.createPoll);

// Route for getting a specific poll
router.get('/getPoll/:id', pollController.getPoll);

// Route for listing all polls
router.get('/allpolls', pollController.listPolls);

module.exports = router;

