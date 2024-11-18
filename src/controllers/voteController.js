// src/controllers/voteController.js
const voteService = require('../services/voteService');
const wsServer = require('../services/websocketService');

exports.castVote = async (req, res) => {
    const { optionId } = req.params;
    const { userId = 'anonymous' } = req.body;

    // Validate if optionId is provided
    if (!optionId) {
        return res.status(400).json({
            success: false,
            message: 'Option ID is required'
        });
    }

    try {
        // Cast the vote
        const result = await voteService.castVote({ optionId, userId });

        // Broadcast the updated vote count to clients via WebSocket
        wsServer.broadcast('vote_update', result);

        // Respond with success message
        return res.json({
            success: true,
            message: 'Vote registered successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in castVote controller:', error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
