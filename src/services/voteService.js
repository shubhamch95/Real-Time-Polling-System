const kafkaService = require('./kafkaService');
const { Option, Vote } = require('../models');

exports.castVote = async (voteData) => {
    try {
        const option = await Option.findByPk(voteData.optionId);
        if (!option) {
            throw new Error(`Option not found with ID: ${voteData.optionId}`);
        }


        const existingVote = await Vote.findOne({
            where: {
                userId: voteData.userId,
                pollId: voteData.pollId,
            },
        });

        if (existingVote) {
            throw new Error('User has already voted for this poll');
        }


        await Vote.create({
            userId: voteData.userId,
            optionId: voteData.optionId,
            pollId: voteData.pollId,
        });


        await Option.update(
            { voteCount: option.voteCount + 1 },
            { where: { id: voteData.optionId } },
        );

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
