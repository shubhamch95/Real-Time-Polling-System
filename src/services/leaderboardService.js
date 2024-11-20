const { Poll, Option } = require('../models');

exports.getLeaderboard = async (pollId) => {
    try {
        // Fetch the poll with its options
        const poll = await Poll.findByPk(pollId, {
            include: [
                {
                    model: Option,
                    attributes: ['id', 'text', 'voteCount'],
                    order: [['voteCount', 'DESC']],
                },
            ],
        });


        if (!poll) {
            throw new Error('Poll not found');
        }

        // Sort options by vote count in descending order
        const options = poll.Options.sort((a, b) => b.voteCount - a.voteCount);

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

// Fetch leaderboard for a specific option in a poll
exports.getLeaderboardForOption = async (pollId, optionId) => {
    try {
        // Fetch the poll with the specific option
        const poll = await Poll.findOne({
            where: { id: pollId },
            include: [
                {
                    model: Option,
                    where: { id: optionId }, // Only fetch the specified option
                    attributes: ['id', 'text', 'voteCount'],
                },
            ],
        });

        if (!poll) return null; // Return null if poll doesn't exist

        // Find the specific option and its vote count
        const option = poll.Options[0]; // Assuming there's only one option with the specified optionId

        if (!option) return null; // Return null if option doesn't exist

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


