const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticate } = require('../middleware/authenticate');


router.post('/castVote/:pollId/:optionId', authenticate, voteController.castVote);

module.exports = router;

