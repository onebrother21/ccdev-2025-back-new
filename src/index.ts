import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import http from 'http';
import { Server } from 'socket.io';

import db from './init/db';
import initialize from './init/app';
//import {initializeSockets} from "./init/sockets";
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
      const cache = await Utils.getRedisCache();
      initialize(this.app,cache);
      //const {server} =  initializeSockets(this.app);
      //this.server = server;
      this.start();
    }
  };
  start = () => {
    (this.server || this.app).listen(port, () => {
      Utils.logger.print("debug","server",`Server is running at https://${host || hostname}:${port}`);
      //Utils.listRoutes(this.app);
    });
  };
}
export default myServer;