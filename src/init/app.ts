import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session,{SessionOptions} from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import passportLocal from 'passport-local';
import compression from 'compression';
import path from 'path';

import localize from './localization';
import mainRouter from './main';
import { corsOptionsDelegate,morganOutputTemplate } from "./app-utils";
import {
  PageNotFound,
  ErrorHandler,
  SetResponseCorsHeaders,
  SetBusinessVars,
  SetUserDevice,
  SetCsrfToken,
  doubleCsrfUtils,
  DecryptData,
  EncryptData,
  SetUserSession,
  SendJson
} from "../middlewares";
import { Routes } from '../routers/routeStrings';
import { bullUIRouter, publicRouter } from '../routers';


const cookieSecret = process.env.COOKIE_SECRET || 'myCookieSecret';
const sessionOpts:SessionOptions = {
  name:"my-ultimate-session",
  secret:cookieSecret,
  saveUninitialized:false,
  resave:false,
  cookie:{maxAge:30 * 60 * 1000},
  store: MongoStore.create({
    collectionName:"ultimate-sessions",
    mongoUrl:process.env.DATABASE_URL,
    autoRemove: 'interval',
    autoRemoveInterval: 30 // In minutes. DefaultmongoOptions: advancedOptions // See below for details
  })
};


export default (app: Express) => {
  app.use(compression());
  app.use(morgan("dev"));
  app.set('views',path.join(__dirname,'../../views'));
  app.set('view engine','ejs');
  app.use(cookieParser(cookieSecret));
  if(app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOpts.cookie.secure = true // serve secure cookies
  }
  app.use(session(sessionOpts));
  // app.use((req,res,next) => {console.log({onLoad:req.session});next();});
  app.use(doubleCsrfUtils.doubleCsrfProtection);
  app.use(SetBusinessVars);
  app.use(SetUserDevice);
  app.use(SetResponseCorsHeaders);
  app.use(cors(corsOptionsDelegate));
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  // app.use(passport.initialize({}));
  // app.use(passport.session({}));
  app.use('/',publicRouter);
  app.use(Routes.jobs,bullUIRouter);
  app.use(DecryptData);
  localize(app);
  mainRouter(app);
  app.use(EncryptData);
  app.use(SetCsrfToken);
  app.use(SetUserSession);
  app.use(SendJson);
  app.use("**",PageNotFound);
  app.use(ErrorHandler);
};