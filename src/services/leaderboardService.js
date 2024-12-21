const { Poll, Option } = require('../models');

exports.getLeaderboard = async (pollId) => {
    try {

        const poll = await Poll.findByPk(pollId, {
            include: [
                {
                    model: Option,
                    as: 'options',
                    attributes: ['id', 'text', 'voteCount'],
                },
            ],
        });

        if (!poll) {
            throw new Error('Poll not found');
        }


        const options = poll.options.sort((a, b) => b.voteCount - a.voteCount);

        return {
            pollId: poll.id,
            pollTitle: poll.title,
            leaderboard: options.map(option => ({
                optionId: option.id,
                text: option.text,
                voteCount: option.voteCount,
            })),
        };
    } catch (error) {
        console.error('Error in getLeaderboard service:', error);
        throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }
};


exports.getLeaderboardForOption = async (pollId, optionId) => {
    try {

        const poll = await Poll.findOne({
            where: { id: pollId },
            include: [
                {
                    model: Option,
                    as: 'options',
                    where: { id: optionId },
                    attributes: ['id', 'text', 'voteCount'],
                },
            ],
        });

        if (!poll) return null;


        const option = poll.options[0];

        if (!option) return null;

        return {
            pollId: poll.id,
            pollTitle: poll.title,
            optionId: option.id,
            optionText: option.text,
            voteCount: option.voteCount,
        };
    } catch (error) {
        console.error('Error in getLeaderboardForOption service:', error);
        throw new Error(`Failed to fetch leaderboard for option ${optionId} in poll ${pollId}: ${error.message}`);
    }
};
