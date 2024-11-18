const { producer, consumer, TOPICS } = require('../config/kafka');
const { Vote, Option } = require('../models');
const { WebSocketServer } = require('../services/websocketService');

const kafkaService = {
    async initialize() {
        try {
            await producer.connect();
            console.log('Kafka Producer connected');

            await consumer.connect();
            console.log('Kafka Consumer connected');

            await consumer.subscribe({ topic: TOPICS.VOTES, fromBeginning: true });
            await startConsumer();
        } catch (error) {
            console.error('Failed to initialize Kafka:', error);
            throw error;
        }
    },

    async sendVote(voteData) {
        try {
            await producer.send({
                topic: TOPICS.VOTES,
                messages: [
                    {
                        key: voteData.optionId,
                        value: JSON.stringify(voteData)
                    }
                ]
            });

            return true;
        } catch (error) {
            console.error('Failed to send vote to Kafka:', error);
            throw error;
        }
    },

    async shutdown() {
        try {
            await producer.disconnect();
            await consumer.disconnect();
        } catch (error) {
            console.error('Error shutting down Kafka:', error);
            throw error;
        }
    }
};

async function startConsumer() {
    try {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Received message:', {
                    topic,
                    partition,
                    value: message.value.toString()
                });

                const voteData = JSON.parse(message.value.toString());
                await processVote(voteData);
            }
        });
    } catch (error) {
        console.error('Error in Kafka consumer:', error);
        throw error;
    }
}

async function processVote(voteData) {
    try {
        await Option.sequelize.transaction(async (t) => {
            await Vote.create({
                userId: voteData.userId,
                optionId: voteData.optionId
            }, { transaction: t });

            const option = await Option.findByPk(voteData.optionId, { transaction: t });
            await option.increment('voteCount', { transaction: t });

            const updatedOption = await Option.findByPk(voteData.optionId, {
                include: ['Poll'],
                transaction: t
            });

            WebSocketServer.broadcast('voteUpdate', {
                pollId: updatedOption.Poll.id,
                optionId: updatedOption.id,
                voteCount: updatedOption.voteCount
            });
        });
    } catch (error) {
        console.error('Error processing vote:', error);
        throw error;
    }
}

module.exports = kafkaService;