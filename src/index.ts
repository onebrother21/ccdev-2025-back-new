import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import expressListRoutes from 'express-list-routes';
import http from 'http';
import { Server } from 'socket.io';
import { User } from './models'; // Assuming User model is in models/User

import db from './init/db';
import RedisCache from './init/redis';
import initialize from './init/app';
import {initializeSockets} from "./init/sockets";
import { logger } from './utils';

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
    //const {server} =  initializeSockets(this.app);
    //this.server = server;
    const cache = new RedisCache();
    await cache.connect({clear:true});
    await cache.test();
  }
  start(){
    (this.server || this.app).listen(port, () => {
      logger.print("server",`Server is running at https://${host || hostname}:${port}`);
      const routes = expressListRoutes(this.app,{
        prefix: '', // A prefix for router Path
        spacer: 7,   // Spacer between router Method and Path
        logger:false, // A custom logger function or a boolean (true for default logger, false for no logging)
        color: true // If the console log should color the method name
      });
      //logger.info("App Routes: ",routes);
    });
  }
}
export default myServer;