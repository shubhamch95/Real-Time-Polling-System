// testWebSocketClient.js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

// Event listener for when the connection is open
ws.on('open', () => {
    console.log('Connected to WebSocket server');

    // Send a vote message after connection is established
    ws.send(JSON.stringify({
        type: 'vote',
        data: {
            userId: 'userId',
            optionId: 'optionId'
        }
    }));

});


ws.on('message', (data) => {
    console.log('Received message:', JSON.parse(data));
});

ws.on('close', () => {
    console.log('Connection closed');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

