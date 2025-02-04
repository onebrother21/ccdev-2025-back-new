import { AppError } from "../utils/common-models";
import { doubleCsrfUtils } from "./set-csrf-token.handler";

const ErrorHandler:IErrorHandler = (err,req,res,next) => {
  if(res.headersSent) return next(err);
  else if(err instanceof AppError) res.status(err.status).json({
    success:false,
    message:err.message
  });
  else if(err == doubleCsrfUtils.invalidCsrfTokenError) res.status(403).json({
    success:false,
    message: "csrf validation error",
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