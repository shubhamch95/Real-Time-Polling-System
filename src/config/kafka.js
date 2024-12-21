const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'polling-system',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: 'polling-group' });

const TOPICS = {
    VOTES: 'poll-votes'
};

module.exports = {
    kafka,
    producer,
    consumer,
    TOPICS
};