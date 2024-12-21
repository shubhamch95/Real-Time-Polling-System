const pollService = require('../services/pollService');
const voteService = require('../services/voteService');
const { Option } = require('../models');

exports.createPoll = async (req, res) => {
  const { title, description, isActive, options, endDate } = req.body;
  const { id: userId } = req.user;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Poll title is required' });
  }

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ success: false, message: 'Poll must have at least 2 options' });
  }

  try {

    const poll = await pollService.createPoll({
      title,
      description,
      isActive,
      options,
      endDate,
      userId
    });

    return res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: {
        poll: {
          id: poll.id,
          title: poll.title,
          description: poll.description,
          isActive: poll.isActive,
          endDate: poll.endDate,
          options: poll.options.map(option => ({ id: option.id, text: option.text }))
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

exports.listPolls = async (req, res) => {
  try {
    const polls = await pollService.listPolls();
    return res.json({ success: true, data: polls });
  } catch (error) {
    console.error('Error in listPolls controller:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch polls' });
  }
};

exports.updatePoll = async (req, res) => {
  const { pollId } = req.params;
  const { title, description, isActive, endDate, options } = req.body;
  const { id: userId } = req.user;

  try {
    const poll = await pollService.getPoll(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this poll' });
    }

    const updatedPollData = {
      title,
      description,
      isActive,
      endDate
    };

    const resultPoll = await pollService.updatePoll(pollId, { ...updatedPollData, options });

    return res.status(200).json({
      success: true,
      message: 'Poll updated successfully',
      data: resultPoll
    });
  } catch (error) {
    console.error('Error updating poll:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.deletePoll = async (req, res) => {
  const { pollId } = req.params;
  const { id: userId } = req.user;

  try {
    const poll = await pollService.getPoll(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (poll.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this poll' });
    }

    await pollService.deletePoll(pollId);

    return res.status(200).json({
      success: true,
      message: 'Poll deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
