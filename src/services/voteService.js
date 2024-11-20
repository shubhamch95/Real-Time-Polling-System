const kafkaService = require('./kafkaService');
const { Option, Vote } = require('../models');

exports.castVote = async (voteData) => {
    console.log('Processing vote:', voteData);

    try {
        // Validate that the option exists
        const option = await Option.findByPk(voteData.optionId);
        if (!option) {
            throw new Error(`Option not found with ID: ${voteData.optionId}`);
        }

        console.log('Found option:', option.toJSON());

        // Check if the user has already voted for this option
        const existingVote = await Vote.findOne({
            where: { userId: voteData.userId, optionId: voteData.optionId }
        });

        if (existingVote) {
            throw new Error('User has already voted for this option');
        }

        // Create the vote record
        await Vote.create({
            userId: voteData.userId,
            optionId: voteData.optionId
        });

        // Update vote count in the Option model
        await Option.update(
            { voteCount: option.voteCount + 1 },
            { where: { id: voteData.optionId } }
        );

        // Fetch the updated vote count
        const updatedOption = await Option.findByPk(voteData.optionId);

        return {
            optionId: updatedOption.id,
            newVoteCount: updatedOption.voteCount,
        };
    } catch (error) {
        console.error('Error in castVote service:', error);
        throw new Error(`Failed to cast vote: ${error.message}`);
    }
};
