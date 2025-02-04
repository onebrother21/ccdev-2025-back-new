import { UAParser } from "ua-parser-js";
import { CommonUtils } from "../utils";

const deviceCookie = process.env.DEVICE_COOKIE || 'deviceCookie';

export const SetUserDevice:IHandler = async (req, res, next) => {
  const cookie = req.signedCookies[deviceCookie];
  const device_ = cookie?CommonUtils.decrypt(cookie):{};
  if(device_) req.device = device_;//check available app versions and refresh device
  else {
    const deviceParser:any = new UAParser(req.headers["user-agent"]);
    const deviceData:any = deviceParser.getResult() || {};
    const deviceId = CommonUtils.longId();
    const device = {id:deviceId,...deviceData};
    res.cookie(deviceCookie,CommonUtils.encrypt(device),{ 
      httpOnly: false, // Set to true for security in production
      secure: false,   // Set to true if using HTTPS
      signed:true
    });
    req.device = device;
  }
  next();
};
export default SetUserDevice;