const voteService = require('../services/voteService');
const wsServer = require('../services/websocketService');

exports.castVote = async (req, res) => {
    const { pollId, optionId } = req.params;

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    if (!pollId || !optionId) {
        return res.status(400).json({
            success: false,
            message: 'Poll ID and Option ID are required'
        });
    }

    try {
        const result = await voteService.castVote({
            pollId,
            optionId,
            userId: req.user.id
        });

        wsServer.broadcast('vote_update', result);

        return res.json({
            success: true,
            message: 'Vote registered successfully',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
