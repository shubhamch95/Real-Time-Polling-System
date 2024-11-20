const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to WebSocket server');

    // Generate a UUID for optionId (matching the DataTypes.UUID field in your table)
    const optionId = uuidv4();

    // Send a vote message after connection is established
    ws.send(JSON.stringify({
        type: 'vote',
        data: {
            userId: 'userId',
            optionId: optionId
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


// // testWebSocketClient.js
// const WebSocket = require('ws');

// const ws = new WebSocket('ws://localhost:3000');

// // Event listener for when the connection is open
// ws.on('open', () => {
//     console.log('Connected to WebSocket server');

//     // Send a vote message after connection is established
//     ws.send(JSON.stringify({
//         type: 'vote',
//         data: {
//             userId: 'userId',
//             optionId: '09a57fe3-eddc-47e7-9632-9b95ef8a5333'
//         }
//     }));

// });


// ws.on('message', (data) => {
//     console.log('Received message:', JSON.parse(data));
// });

// ws.on('close', () => {
//     console.log('Connection closed');
// });

// ws.on('error', (error) => {
//     console.error('WebSocket error:', error);
// });

