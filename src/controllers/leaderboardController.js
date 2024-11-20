const leaderboardService = require('../services/leaderboardService');

exports.getLeaderboard = async (req, res) => {
    const { pollId } = req.params;

    if (!pollId) {
        return res.status(400).json({
            success: false,
            message: 'Poll ID is required',
        });
    }

    try {
        const leaderboard = await leaderboardService.getLeaderboard(pollId);
        return res.json({
            success: true,
            data: leaderboard,
        });
    } catch (error) {
        console.error('Error in getLeaderboard controller:', error);
        const statusCode = error.message === 'Poll not found' ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getLeaderboardForOption = async (req, res) => {
    const { pollId, optionId } = req.params;

    try {
        const option = await leaderboardService.getLeaderboardForOption(pollId, optionId);
        if (!option) {
            return res.status(404).json({
                success: false,
                message: 'Option not found in the given poll.',
            });
        }

        return res.json({
            success: true,
            data: option,
        });
    } catch (error) {
        console.error('Error in getLeaderboardForOption controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve leaderboard for the specific option.',
        });
    }
};






