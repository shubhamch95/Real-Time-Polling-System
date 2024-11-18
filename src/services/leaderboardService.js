// src/services/leaderboardService.js
const { Poll, Option, Vote, sequelize } = require('../models');
const { Op } = require('sequelize');

// Exporting functions at the start
exports.getLeaderboard = async (pollId, timeframe) => {
    try {
        const timeFilter = _getTimeFilter(timeframe);

        const options = await Option.findAll({

            where: {
                pollId: pollId
            },
            attributes: [
                'id',
                'text',
                'voteCount',
                [sequelize.literal('(SELECT COUNT(*) FROM votes WHERE votes.optionId = Option.id AND votes.createdAt >= :startDate)'), 'periodVotes']
            ],
            replacements: {
                startDate: timeFilter.startDate
            },
            order: [[sequelize.literal('periodVotes'), 'DESC']],
            include: [{
                model: Poll,
                attributes: ['title']
            }]
        });

        return options.map(option => ({
            optionId: option.id,
            text: option.text,
            totalVotes: option.voteCount,
            periodVotes: parseInt(option.getDataValue('periodVotes')),
            pollTitle: option.Poll.title
        }));
    } catch (error) {
        throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
};

exports.getPollStats = async (pollId) => {
    try {
        const poll = await Poll.findByPk(pollId, {
            include: [{
                model: Option,
                attributes: ['id', 'text', 'voteCount']
            }]
        });

        if (!poll) {
            throw new Error('Poll not found');
        }

        const totalVotes = poll.Options.reduce((sum, option) => sum + option.voteCount, 0);
        const optionStats = poll.Options.map(option => ({
            optionId: option.id,
            text: option.text,
            votes: option.voteCount,
            percentage: totalVotes > 0 ? ((option.voteCount / totalVotes) * 100).toFixed(2) : 0
        }));

        return {
            pollId: poll.id,
            title: poll.title,
            totalVotes,
            optionStats,
            createdAt: poll.createdAt,
            endDate: poll.endDate
        };
    } catch (error) {
        throw new Error(`Failed to get poll stats: ${error.message}`);
    }
};

exports.getTopPolls = async (limit = 10, timeframe = 'all') => {
    try {
        const timeFilter = _getTimeFilter(timeframe);

        const polls = await Poll.findAll({
            attributes: [
                'id',
                'title',
                [sequelize.literal(`(
                    SELECT SUM(options.voteCount) 
                    FROM options 
                    WHERE options.pollId = Poll.id
                )`), 'totalVotes']
            ],
            where: {
                createdAt: {
                    [Op.gte]: timeFilter.startDate
                }
            },
            order: [[sequelize.literal('totalVotes'), 'DESC']],
            limit: limit
        });

        return polls.map(poll => ({
            pollId: poll.id,
            title: poll.title,
            totalVotes: parseInt(poll.getDataValue('totalVotes')) || 0
        }));
    } catch (error) {
        throw new Error(`Failed to get top polls: ${error.message}`);
    }
};

// Helper function to calculate time filter
const _getTimeFilter = (timeframe) => {
    const now = new Date();
    let startDate = new Date(0); // Default to beginning of time

    switch (timeframe) {
        case 'daily':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'weekly':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'monthly':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
    }

    return { startDate };
};
