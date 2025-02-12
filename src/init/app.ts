import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import path from 'path';

import localize from './localization';
import {
  corsOptionsDelegate,
  morganOutputTemplate,
  sessionOpts,
} from "./app-utils";
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
import v2Router, {AppPublicRouter,AdminBullUiRouter } from '../_v2';
const cookieSecret = process.env.COOKIE_SECRET || 'myCookieSecret';

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
  app.use(doubleCsrfUtils.doubleCsrfProtection);
  app.use(SetCsrfToken);
  app.use(SetBusinessVars);
  app.use(SetUserDevice);
  app.use(SetResponseCorsHeaders);
  app.use(cors(corsOptionsDelegate));
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  app.use('/',AppPublicRouter);
  app.use("/jobs",AdminBullUiRouter);
  app.use(DecryptData);
  //localize(app);
  app.use("/v2",v2Router);
  app.use("**",PageNotFound);
  app.use(ErrorHandler);
};