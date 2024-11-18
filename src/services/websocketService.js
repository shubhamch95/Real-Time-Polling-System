const WebSocket = require('ws');
const voteService = require('../services/voteService');

let wss;
let clients = new Set();

// Initialize WebSocket server
exports.initialize = (server) => {
    if (!server) {
        throw new Error('HTTP server is required');
    }

    // Create WebSocket server on the provided HTTP server
    wss = new WebSocket.Server({ server });

    // When a client connects to the WebSocket server
    wss.on('connection', (ws) => {
        console.log('New client connected');
        clients.add(ws); // Add the new client to the set

        // When the client disconnects
        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws); // Remove client from the set
        });

        // Handle incoming messages from clients
        ws.on('message', async (message) => {
            console.log('Received message from client:', message);

            try {
                const parsedMessage = JSON.parse(message); // Parse the incoming message

                // Check for missing or malformed 'type'
                if (!parsedMessage.type) {
                    return ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Missing "type" field in the message'
                    }));
                }

                // If the message type is 'vote', process the vote
                if (parsedMessage.type === 'vote') {
                    const { userId, optionId } = parsedMessage.data;

                    // Check if 'data' object is missing
                    if (!parsedMessage.data) {
                        return ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Missing "data" object in the vote message'
                        }));
                    }

                    // Check for missing 'userId' or 'optionId'
                    if (!userId || !optionId) {
                        return ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Missing "userId" or "optionId"'
                        }));
                    }

                    // Validate 'userId' and 'optionId' types
                    if (typeof userId !== 'string' || typeof optionId !== 'string') {
                        return ws.send(JSON.stringify({
                            type: 'error',
                            message: '"userId" and "optionId" must be strings'
                        }));
                    }

                    // Call the vote service to process the vote
                    const result = await voteService.castVote({ userId, optionId });

                    // Broadcast the updated vote information to all connected clients
                    exports.broadcast('vote_update', result);

                    // Respond to the client with the result
                    ws.send(JSON.stringify({
                        type: 'vote_response',
                        message: 'Vote registered successfully',
                        data: result
                    }));
                } else {
                    // If the message type is not 'vote', respond with an error
                    return ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Invalid message type. Expected "vote".'
                    }));
                }

            } catch (error) {
                // Handle any errors that occur during message processing
                console.error('Error parsing message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid message format. Could not parse JSON.',
                    error: error.message
                }));
            }
        });

        // Send a welcome message when the client connects
        ws.send(JSON.stringify({
            type: 'connection', message: 'Connected to polling system'
        }));
    });
};

// Broadcast a message to all connected clients
exports.broadcast = (type, data) => {
    const message = JSON.stringify({ type, data }); // Prepare the message

    // Send the message to all clients that are currently open
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
