const { Poll, Option } = require('../models');

exports.createPoll = async (pollData) => {
    const { title, description, endDate, options, userId, isActive } = pollData;

    if (!options || !Array.isArray(options)) {
        throw new Error('Options must be a valid array');
    }

    if (!userId) {
        throw new Error('User ID is required');
    }

    try {

        const existingPoll = await Poll.findOne({
            where: { title, userId }
        });

        if (existingPoll) {
            throw new Error('A poll with this title already exists for the user');
        }


        const result = await Poll.sequelize.transaction(async (t) => {
            const poll = await Poll.create(
                {
                    title,
                    description,
                    endDate: endDate || null,
                    userId,
                    isActive: isActive || true
                },
                { transaction: t }
            );


            if (options.length > 0) {
                const optionRecords = options.map(optionText => ({
                    text: optionText,
                    pollId: poll.id
                }));

                await Option.bulkCreate(optionRecords, { transaction: t });
            }


            return await Poll.findByPk(poll.id, {
                include: [{
                    model: Option,
                    as: 'options',
                    required: false
                }],
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
            include: [{
                model: Option,
                as: 'options'
            }]
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
            include: [{
                model: Option,
                as: 'options'
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log('Successfully fetched polls:', polls.length);
        return polls.map(poll => poll.toJSON());
    } catch (error) {
        console.error('Error in listPolls:', error);
        throw new Error(`Failed to list polls: ${error.message}`);
    }
};

exports.updatePoll = async (pollId, pollData) => {
    const { title, description, isActive, endDate, options } = pollData;

    try {

        const poll = await Poll.findByPk(pollId, {
            include: [{
                model: Option,
                as: 'options'
            }]
        });

        if (!poll) {
            throw new Error('Poll not found');
        }


        await poll.update({
            title,
            description,
            isActive,
            endDate
        });


        if (options && options.length > 0) {

            const existingOptions = await Option.findAll({
                where: { pollId: poll.id },
                attributes: ['text']
            });

            const existingOptionTexts = existingOptions.map(option => option.text.toLowerCase());


            const duplicateOptions = options.filter(optionText =>
                existingOptionTexts.includes(optionText.toLowerCase())
            );

            if (duplicateOptions.length > 0) {
                throw new Error(`The following options already exist: ${duplicateOptions.join(', ')}`);
            }


            const optionsToAdd = options.map(optionText => ({
                text: optionText,
                pollId: poll.id
            }));

            await Option.bulkCreate(optionsToAdd);
        }


        const updatedPoll = await Poll.findByPk(pollId, {
            include: [{
                model: Option,
                as: 'options'
            }]
        });

        return updatedPoll;
    } catch (error) {
        throw new Error(`Failed to update poll: ${error.message}`);
    }
};

exports.deletePoll = async (pollId) => {
    try {

        await Poll.sequelize.transaction(async (t) => {

            await Option.destroy({
                where: { pollId },
                transaction: t,
            });


            const deletedCount = await Poll.destroy({
                where: { id: pollId },
                transaction: t,
            });

            if (deletedCount === 0) {
                throw new Error('Poll not found');
            }
        });
    } catch (error) {
        throw new Error(`Failed to delete poll: ${error.message}`);
    }
};


