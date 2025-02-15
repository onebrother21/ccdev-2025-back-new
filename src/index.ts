import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import expressListRoutes from 'express-list-routes';
import http from 'http';
import { Server } from 'socket.io';

import db from './init/db';
import getRedisCache from './init/redis-cache';
import initialize from './init/app';
import {initializeSockets} from "./init/sockets";

import Models from './models';
import Utils from './utils';

const dbString = process.env.DATABASE_URL || "";
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const host = process.env.HOST;

class myServer {
  app:Express = express();
  server:http.Server;
  init = async (startDb:boolean,startServer:boolean) => {
    if(startDb && dbString && startServer){
      await db.connect(dbString);
      const cache = await getRedisCache();
      initialize(this.app,cache);
      //const {server} =  initializeSockets(this.app);
      //this.server = server;
      this.start();
    }
  }
  start(){
    (this.server || this.app).listen(port, () => {
      Utils.logger.print("debug","server",`Server is running at https://${host || hostname}:${port}`);
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