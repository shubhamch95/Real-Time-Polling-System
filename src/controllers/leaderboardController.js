// src/controllers/leaderboardController.js
const leaderboardService = require('../services/leaderboardService');

exports.getLeaderboard = async (req, res) => {
    try {
        const { pollId } = req.params;
        const timeframe = req.query.timeframe || 'all'; // 'all', 'daily', 'weekly', 'monthly'

        if (!pollId) {
            return res.status(400).json({
                success: false,
                message: 'Poll ID is required'
            });
        }

        const leaderboard = await leaderboardService.getLeaderboard(pollId, timeframe);

        res.json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        console.error('Error in getLeaderboard controller:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPollStats = async (req, res) => {
    try {
        const { pollId } = req.params;

        if (!pollId) {
            return res.status(400).json({
                success: false,
                message: 'Poll ID is required'
            });
        }

        const stats = await leaderboardService.getPollStats(pollId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getPollStats controller:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTopPolls = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const timeframe = req.query.timeframe || 'all';

        const topPolls = await leaderboardService.getTopPolls(limit, timeframe);

        res.json({
            success: true,
            data: topPolls
        });
    } catch (error) {
        console.error('Error in getTopPolls controller:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};