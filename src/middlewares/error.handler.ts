import Utils from "../utils";
import { doubleCsrfUtils } from "./set-csrf-token.handler";


const clockBugsQ = Utils.createQueue("clock-bugs");
const ErrorHandler:() => IErrorHandler = () => async (err,req,res,next) => {
  if(res.headersSent) return next(err);
  else if(err instanceof Utils.AppError) res.status(err.status).json({
    success:false,
    message:err.message
  });
  else if(err == doubleCsrfUtils.invalidCsrfTokenError) res.status(403).json({
    success:false,
    message: "csrf validation error",
  });
  else if(err.name == "TokenExpiredError") res.status(401).json({
    success:false,
    message:"Token expired. Please login.",
  });
  else if(/malformed/i.test(err.message))  Utils.logger.error(err) && res.status(403).json({
    success:false,
    message:"Forbidden",
  });
  else if(/validation/i.test(err.message) || /validation/i.test(err.name)) res.status(422).json({
    success:false,
    message:"Operation failed. Please check your data and try again.",
    error:{...err}
  });
  else if((err as any).status && (err as any).status < 500) res.status((err as any).status).json({
    success:false,
    message:err.message
  });
  else Utils.logger.error(err) && await clockBugsQ.add("clock-bug-job",{
    creator:req.profile?req.profile.id:null,
    creatorRef:req.user?req.user.role:"customer",
    category:"backend",
    type:"api-error",
    name:"unknown",
    description:err.message,
    info:{err}
  }) && res.status(500).json({
    success:false,
    message:err.message
  });
};
export default ErrorHandler;