import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import path from 'path';

import localize from './localization';

import {
  PageNotFound,
  ErrorHandler,
  SetResponseCorsHeaders,
  SetBusinessVars,
  SetUserDevice,
  SetCsrfToken,
  doubleCsrfUtils,
  DecryptData,
} from "../middlewares";
import getV2Router, {AppPublicRouter,AdminBullUiRouter } from '../_v2';
import { RedisCache } from './redis-cache';
import Utils from "../utils";
const cookieSecret = process.env.COOKIE_SECRET || 'myCookieSecret';

export default (app: Express,cache:RedisCache) => {
  app.use(compression());
  app.use(morgan("dev"));
  app.set('views',path.join(__dirname,'../../views'));
  app.set('view engine','ejs');
  app.use(SetBusinessVars(cache));
  app.use(cookieParser(cookieSecret));
  if(app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    Utils.sessionOpts.cookie.secure = true // serve secure cookies
  }
  app.use(session(Utils.sessionOpts));
  app.use(doubleCsrfUtils.doubleCsrfProtection);
  app.use(SetCsrfToken);
  app.use(SetUserDevice);
  app.use(SetResponseCorsHeaders);
  app.use(cors(Utils.corsOptionsDelegate));
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  app.use('/',AppPublicRouter(cache));
  app.use("/jobs",AdminBullUiRouter(cache));
  app.use(DecryptData);
  localize(app);
  app.use("/av2",getV2Router(cache));
  app.use("**",PageNotFound);
  app.use(ErrorHandler);
};