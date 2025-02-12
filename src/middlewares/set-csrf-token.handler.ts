import { CommonUtils } from "../utils";
import { doubleCsrf, DoubleCsrfConfigOptions } from "csrf-csrf";


const csrfSecret = process.env.CSRF_SECRET;
const doubleCsrfOptions:DoubleCsrfConfigOptions =  {
  getSecret: () => csrfSecret, // A function that optionally takes the request and returns a secret
  //getSessionIdentifier: (req:IRequest) => "", // A function that should return the session identifier for a given request
  cookieName:"x-csrf-token", // The name of the cookie to be used, recommend using Host prefix. "__Host-psifi."
  cookieOptions: {
    sameSite:false,  // Recommend you make this strict if posible
    path:"/",
    secure: process.env.NODE_ENV === 'production',
  },
  // size: 64, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"] as any[], // A list of request methods that will not be protected.
  getTokenFromRequest: (req:IRequest) => req.headers["x-csrf-token"] || req.cookies["XSRF-TOKEN"], // A function that returns the token from the request
};
const doubleCsrfUtils = doubleCsrf(doubleCsrfOptions);

const SetCsrfToken:IHandler = async (req, res, next) => {
  const csrfToken = doubleCsrfUtils.generateToken(req,res);
  res.locals.csrfToken = csrfToken;
  res.cookie('XSRF-TOKEN',csrfToken,{
    sameSite: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  next();
};
export {SetCsrfToken,doubleCsrfUtils};