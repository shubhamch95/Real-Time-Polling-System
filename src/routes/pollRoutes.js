const express = require('express');
const pollController = require('../controllers/pollController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/createPoll', authenticate, pollController.createPoll);
router.put('/updatePoll/:pollId', authenticate, pollController.updatePoll);
router.get('/getPoll/:id', pollController.getPoll);
router.get('/allpolls', pollController.listPolls);
router.delete('/deletePoll/:pollId', authenticate, pollController.deletePoll);

module.exports = router;
