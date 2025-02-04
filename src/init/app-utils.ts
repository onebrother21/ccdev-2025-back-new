import { CorsOptions } from "cors";
import { AppError } from "../utils";

const whitelist = JSON.parse(process.env.WHITELIST||"[]");
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
const corsOptionsDelegate = function (req:IRequest, callback:Function) {
  const isApiRoute = /api/.test(req.url);
  const wl = req.bvars && req.bvars["origins"]?req.bvars["origins"]:whitelist;
  const origin = req.header("Origin");
  console.log({origin});
  switch(true){
    case !origin:
    case wl.includes(origin):{
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


export {
  corsValidator,
  corsOptionsDelegate,
  morganOutputTemplate,
}