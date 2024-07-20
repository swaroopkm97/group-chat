# Group Chat Application

A real-time group chat application with user authentication and message persistence. This application allows users to log in, join chat rooms, and exchange messages with others in the same room. It also supports user registration, login, and retrieval of the latest messages.

## Features

- **User Authentication**: Users can sign up or log in to access the chat functionality.
- **Group Chat Rooms**: Users can join predefined chat rooms (e.g., Cricket, Football).
- **Real-Time Messaging**: Messages are exchanged in real-time using WebSockets.
- **Message Persistence**: Messages are stored in a MongoDB database and retrieved upon login.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **WebSockets**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (installed and running)

### Clone the Repository

```bash
git clone https://github.com/swaroopkm97/group-chat.git
cd group-chat-app
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost/advanced-chat
```

Replace `your_jwt_secret` with your preferred JWT secret and `MONGO_URI` with your MongoDB connection string.

### Run the Application

```bash
npm start
```

The server will start on `http://localhost:3000`.

## Usage

### Frontend

1. Open `http://localhost:3000` in your web browser.
2. On the login/signup page, enter your username and password.
3. Select a chat room from the dropdown menu (e.g., Cricket, Football).
4. Click "Login" to access the chat room.

### Backend API Endpoints

- **POST /auth/register**

  Registers a new user.

  Request Body:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

- **POST /auth/login**

  Authenticates a user and returns a JWT token.

  Request Body:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

## Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the server with `nodemon`, which automatically restarts the server when changes are made.

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

## Folder Structure

- **`public/`**: Contains the static files for the frontend (HTML, CSS, JavaScript).
- **`routes/`**: Contains the Express route handlers.
- **`models/`**: Contains Mongoose models for MongoDB collections.
- **`server.js`**: The entry point for the Node.js application.
- **`package.json`**: Contains project metadata and dependencies.

## Code Snippets

### Destructuring Request Body

In the route handlers, object destructuring is used to extract `username` and `password` from the request body:

```javascript
const { username, password } = req.body;
```

### Handling Socket Events

Socket.io is used for real-time communication:

```javascript
io.on('connection', (socket) => {
    socket.on('join room', (room) => {
        socket.join(room);
    });

    socket.on('chat message', async (msg) => {
        const message = new Message({
            sender: socket.user.username,
            room: msg.room,
            text: msg.text
        });
        await message.save();
        io.to(msg.room).emit('chat message', { sender: socket.user.username, text: msg.text });
    });

    socket.on('private message', async (msg) => {
        const message = new Message({
            sender: socket.user.username,
            recipient: msg.recipient,
            text: msg.text
        });
        await message.save();
        socket.to(msg.recipient).emit('private message', { sender: socket.user.username, text: msg.text });
    });
});
```

## Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
