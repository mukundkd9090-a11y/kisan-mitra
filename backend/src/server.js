const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Attach socket io to express app instance
app.set('io', io);

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Base Health route
app.get('/', (req, res) => {
  res.json({
    app: 'KisanMitra Backend Server',
    status: 'ONLINE',
    description: 'KisanMitra - Farmer Procurement Queue Intelligence',
    timestamp: new Date().toISOString()
  });
});

// Real-time Socket.IO connection handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO] New client connected: ${socket.id}`);

  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`[Socket.IO] User ${userId} joined room user_${userId}`);
  });

  socket.on('join_centre_room', (centreId) => {
    socket.join(`centre_${centreId}`);
    console.log(`[Socket.IO] Socket joined centre room centre_${centreId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🌾 KisanMitra Backend API running on port ${PORT}`);
  console.log(`  🚀 Real-time WebSockets initialized (Socket.IO)`);
  console.log(`====================================================`);
});
