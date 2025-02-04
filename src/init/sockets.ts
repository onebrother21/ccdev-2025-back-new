import Express from "express";
import http from 'http';
import { Server, Socket } from 'socket.io';
import { User } from '../models'; // Assuming User model is in models/User
import * as AllTypes from "../types";

const dbString = process.env.DATABASE_URL;
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const host = process.env.HOST;


const userSockets: Map<string, Socket> = new Map();

const initializeSockets = (app:Express.Application) => {
  const server = http.createServer(app);
  const io = new Server(server);
  // Register user socket
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Register event - save the socketId to the user
    socket.on('register', async (userId: string) => {
      const user = await User.findById(userId);
      if (user) {
        userSockets.set(userId, socket);
        user.socketId = socket.id;
        user.setStatus(AllTypes.IUserStatuses.ACTIVE); // Mark as inactive
        await user.save();
        console.log(`User ${userId} registered with socketId: ${socket.id}`);
      }
    });

    // Disconnect event - mark user as inactive and remove socketId
    socket.on('disconnect', async () => {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        userSockets.delete(user.id);
        user.socketId = null;
        user.setStatus(AllTypes.IUserStatuses.INACTIVE); // Mark as inactive
        await user.save();
        console.log(`User ${user._id} disconnected and marked as inactive.`);
      }
    });

    // Handle new notifications
    socket.on('new-notification', (notificationData) => {
      // Handle the notification data sent from the backend (can be pushed via socket to the front end)
      socket.emit('notification', notificationData); // Send the notification to the connected client
    });
  });
  return {server,io};
};
const getUserSocket = (userId: string): Socket|null => {
  const socket = userSockets.get(userId);
  return socket && socket.connected? socket : null;
};
export {initializeSockets,getUserSocket};