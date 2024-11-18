// src/services/pollService.js
const { Poll, Option } = require('../models');

// Export functions at the start
exports.createPoll = async (pollData) => {
    const { title, description, endDate, options } = pollData;

    try {
        // Create poll with its options in a transaction
        const result = await Poll.sequelize.transaction(async (t) => {
            // Create the poll
            const poll = await Poll.create(
                {
                    title,
                    description,
                    endDate: endDate || null
                },
                { transaction: t }
            );

            // Create options if provided
            if (Array.isArray(options) && options.length > 0) {
                const optionRecords = options.map(optionText => ({
                    text: optionText,
                    pollId: poll.id
                }));

                await Option.bulkCreate(optionRecords, { transaction: t });
            }

            // Fetch the complete poll with options
            return await Poll.findByPk(poll.id, {
                include: [Option],
                transaction: t
            });
        });

        return result;
    } catch (error) {
        throw new Error(`Failed to create poll: ${error.message}`);
    }
};

exports.getPoll = async (pollId) => {
    try {
        const poll = await Poll.findByPk(pollId, {
            include: [Option]
        });

        if (!poll) {
            throw new Error('Poll not found');
        }

        return poll;
    } catch (error) {
        throw new Error(`Failed to get poll: ${error.message}`);
    }
};

exports.listPolls = async () => {
    try {
        console.log('Attempting to fetch all polls...');
        const polls = await Poll.findAll({
            include: [Option],
            order: [['createdAt', 'DESC']]
        });

        console.log('Successfully fetched polls:', polls.length);

        // Serialize the result to remove Sequelize internal methods
        return polls.map(poll => poll.toJSON());
    } catch (error) {
        console.error('Error in listPolls:', error);
        throw new Error(`Failed to list polls: ${error.message}`);
    }
};
