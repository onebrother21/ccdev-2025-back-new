import { CorsOptions } from "cors";
import { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import { AppError } from "./common-models";
import Utils from "utils";

const whitelist = JSON.parse(process.env.ORIGINS||"[]");
const corsOptions:any = {
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-AppUserClientKey', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};
const corsValidator = (origin:string|undefined, next:Function) => {
  return whitelist.includes(origin || "")?next(null,true):next(new AppError({
    message:"Request not allowed",
    status:403
  }),false);
};
/** Assumes that no-origin requests are web requests for server pages only */
const corsOptionsDelegate = function (req:IRequest, callback:Function) {
  const isApiRoute = /api/.test(req.url);
  const ip = req.ip;
  const wl = req.bvars && req.bvars["origins"]?req.bvars["origins"]:whitelist;
  const bl = req.bvars && req.bvars["blacklist"]?req.bvars["blacklist"]:[];
  const origin = req.header("Origin");
  Utils.logger.info({origin,ip});
  switch(true){
    case !origin:
    case wl.includes(origin) && !bl.includes(ip):{
      corsOptions.origin = true;
      return callback(null,corsOptions);
    }
    default:{
      corsOptions.origin = false;
      return callback(new AppError({
        message:"Request not allowed",
        status:403
      }),corsOptions);
    }
  }
}
const morganOutputTemplate = ':method :url :status [:remote-addr :user-agent :date[iso]]';
//':res[content-length] - :response-time ms'

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

export {
  corsValidator,
  corsOptionsDelegate,
  morganOutputTemplate,
  sessionOpts,
}