// src/controllers/pollController.js
const pollService = require('../services/pollService');

// Create a new poll
exports.createPoll = async (req, res) => {
  const pollData = req.body;

  // Basic validation
  if (!pollData.title) {
    return res.status(400).json({ success: false, message: 'Poll title is required' });
  }

  if (!Array.isArray(pollData.options) || pollData.options.length < 2) {
    return res.status(400).json({ success: false, message: 'Poll must have at least 2 options' });
  }

  try {
    const poll = await pollService.createPoll(pollData);
    return res.status(201).json({ success: true, data: poll });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific poll by ID
exports.getPoll = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await pollService.getPoll(id);
    return res.json({ success: true, data: poll });
  } catch (error) {
    const statusCode = error.message === 'Poll not found' ? 404 : 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [{
        model: Option,
        as: 'Options',
        attributes: {
          exclude: ['PollId']
        }
      }]
    });

    const pollData = poll.toJSON();
    pollData.Options = pollData.Options.map(option => {
      const { PollId, ...rest } = option;
      return rest;
    });

    res.json({
      success: true,
      data: pollData
    });
  } catch (error) {
    // Error handling
  }
};

// List all polls
exports.listPolls = async (req, res) => {
  try {
    const polls = await pollService.listPolls();
    return res.json({ success: true, data: polls });
  } catch (error) {
    console.error('Error in listPolls controller:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch polls' });
  }
};
