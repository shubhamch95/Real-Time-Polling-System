const WebSocket = require('ws');
const voteService = require('../services/voteService');

let wss;
let clients = new Set();


exports.initialize = (server) => {
    if (!server) {
        throw new Error('HTTP server is required');
    }


    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');
        clients.add(ws);

        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws);
        });

        ws.on('message', async (message) => {
            console.log('Received message from client:', message);

            try {
                const parsedMessage = JSON.parse(message);


                if (!parsedMessage.type) {
                    return ws.send(JSON.stringify({
                        type: 'error', message: 'Missing "type" field in the message'
                    }));
                }


                if (parsedMessage.type === 'vote') {
                    const { userId, optionId } = parsedMessage.data;


                    if (!parsedMessage.data) {
                        return ws.send(JSON.stringify({
                            type: 'error', message: 'Missing "data" object in the vote message'
                        }));
                    }

                    if (!userId || !optionId) {
                        return ws.send(JSON.stringify({
                            type: 'error', message: 'Missing "userId" or "optionId"'
                        }));
                    }


                    if (typeof userId !== 'string' || typeof optionId !== 'string') {
                        return ws.send(JSON.stringify({
                            type: 'error', message: '"userId" and "optionId" must be strings'
                        }));
                    }


                    const result = await voteService.castVote({ userId, optionId });


                    exports.broadcast('vote_update', result);


                    ws.send(JSON.stringify({
                        type: 'vote_response', message: 'Vote registered successfully', data: result
                    }));
                } else {

                    return ws.send(JSON.stringify({
                        type: 'error', message: 'Invalid message type. Expected "vote".'
                    }));
                }

            } catch (error) {
                console.error('Error parsing message:', error);
                ws.send(JSON.stringify({
                    type: 'error', message: 'Invalid message format. Could not parse JSON.',
                    error: error.message
                }));
            }
        });

        ws.send(JSON.stringify({
            type: 'connection', message: 'Connected to polling system'
        }));
    });
};


exports.broadcast = (type, data) => {
    const message = JSON.stringify({ type, data });


    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
