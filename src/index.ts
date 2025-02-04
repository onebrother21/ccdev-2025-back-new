import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { User } from './models'; // Assuming User model is in models/User

import db from './init/db';
import RedisCache from './init/redis';
import initialize from './init/app';
import {initializeSockets} from "./init/sockets";
import initNotificationQueues from './workers';

const dbString = process.env.DATABASE_URL || "";
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const host = process.env.HOST;

class myServer {
  app:Express = express();
  server:http.Server;
  init = async (startDb:boolean,startServer:boolean) => {
    if(startDb && dbString) await db.connect(dbString);
    if(startServer){
      initialize(this.app);
      this.start();
    }
    //await initNotificationQueues({interval:5});
    //const {server} =  initializeSockets(this.app);
    //this.server = server;
    const cache = new RedisCache();
    await cache.connect({clear:true});
    await cache.test();
  }
  start(){
    (this.server || this.app).listen(port, () => {
      console.log(`⚡️ [server]: Server is running at https://${host || hostname}:${port}`);
    });
  }
}
export default myServer;