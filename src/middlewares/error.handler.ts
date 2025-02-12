import { AppError, logger } from "../utils";
import { doubleCsrfUtils } from "./set-csrf-token.handler";

const ErrorHandler:IErrorHandler = (err,req,res,next) => {
  if(res.headersSent) return next(err);
  else if(err instanceof AppError) logger.error(err.json()) && res.status(err.status).json({
    success:false,
    message:err.message
  });
  else if(err == doubleCsrfUtils.invalidCsrfTokenError) res.status(403).json({
    success:false,
    message: "csrf validation error",
  });
  else if(/validation/i.test(err.message) || /validation/i.test(err.name)) res.status(422).json({
    success:false,
    message:"Operation failed. Please check your data and try again.",
    error:err.message
  });
  else if((err as any).status && (err as any).status < 500) res.status((err as any).status).json({
    success:false,
    message:err.message
  });
  else {
    console.error(err);
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};
export default ErrorHandler;