const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'polling-system',
    brokers: ['localhost:9092']
});


// Create producer instance
const producer = kafka.producer();

// Create consumer instance
const consumer = kafka.consumer({ groupId: 'polling-group' });

// Topics
const TOPICS = {
    VOTES: 'poll-votes'
};

module.exports = {
    kafka,
    producer,
    consumer,
    TOPICS
};