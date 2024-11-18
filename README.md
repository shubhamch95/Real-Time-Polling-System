# Real-Time Polling System

A scalable real-time polling system built with **Node.js**, **Express**, **PostgreSQL**, **Kafka**, and **WebSocket**. This system allows users to create polls, cast votes, and get real-time updates on voting results.

## Features

- Create and manage polls with multiple options
- Real-time vote tracking using WebSocket
- Event-driven architecture using Kafka
- RESTful API endpoints
- Leaderboard system with time-based filtering
- Comprehensive statistics and analytics
- Database persistence with PostgreSQL
- Scalable and maintainable codebase

## Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Apache Kafka**
- **npm** or **yarn**

## Installation

### 1. Clone the repository:

```bash
git clone [repository-url]
cd polling-system
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

Create a `.env` file in the root directory and add the following configurations:

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=polling_system
```

### 4. Set up PostgreSQL database:

```bash
CREATE DATABASE polling_system;
```

### 5. Start Kafka server and create required topics:

#### Start Zookeeper
To start the Zookeeper server, run the following command:

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

#### Start Kafka
To start the Kafka, run the following command:
```bash
bin/kafka-server-start.sh config/server.properties
```

#### Create topic
```bash
bin/kafka-topics.sh --create --topic poll-votes --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

## Project Structure

```bash
src/
├── config/
│   ├── database.js
│   └── kafka.js
├── controllers/
│   ├── pollController.js
│   ├── voteController.js
│   └── leaderboardController.js
├── models/
│   ├── index.js
│   ├── Poll.js
│   ├── Option.js
│   └── Vote.js
├── routes/
│   ├── pollRoutes.js
│   ├── voteRoutes.js
│   └── leaderboardRoutes.js
├── services/
│   ├── pollService.js
│   ├── voteService.js
│   ├── kafkaService.js
│   ├── websocketService.js
│   └── leaderboardService.js
└── server.js
```

## API Endpoints
#### Polls

POST /api/v1/polls/createPoll 
- Create a new poll

GET /api/v1/polls/getPoll/:id 
- Get poll by ID

GET /api/v1/polls/allpolls 
- List all polls

#### Votes

###### POST /api/v1/vote/vote/:optionId

 - Cast a vote for an option

#### Leaderboard

GET  /api/v1/leaderboard/poll/:pollId 
- Get leaderboard for a specific poll

GET /api/v1/leaderboard/stats/:pollId 
- Get detailed stats for a poll

GET /api/v1/leaderboard/top-polls 
- Get top polls

## WebSocket Events

### Client -> Server

```bash
// Cast a vote
{
    type: 'vote',
    data: {
        userId: 'string',
        optionId: 'string'
    }
}
```

### Server -> Client

```bash
// Vote update
{
    type: 'vote_update',
    data: {
        optionId: 'string',
        newVoteCount: number
    }
}
```

## Running the Application

### Start the server:

```bash
npm start
```

### Test WebSocket connection (optional):

```bash
node src/testWebSocketClient.js
```

### Testing
To run the test WebSocket client:

```bash
node src/testWebSocketClient.js
```

## Error Handling
#### The application includes comprehensive error handling:

- Input validation

- Database connection errors

- WebSocket connection errors

- Kafka producer/consumer errors

- Duplicate vote prevention

## Contributing

- Fork the repository

- Create your feature branch (git checkout -b feature/AmazingFeature)

- Commit your changes (git commit -m 'Add some AmazingFeature')

- Push to the branch (git push origin feature/AmazingFeature)

- Open a Pull Request

## License
This project is licensed under the MIT License.
