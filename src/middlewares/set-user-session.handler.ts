import * as AllTypes from "../types";

export const SetUserSession:IHandler = (req,res,next) => {
  const {id,username} = req.user as AllTypes.IUser;
  (req.session as any).user = {id,username,role:AllTypes.IProfileTypes.CUSTOMER};
  (req.session as any).pageViews = ((req.session as any).pageViews || 0) + 1;
  (req.session as any).lastAction = req.method.toLocaleUpperCase() + " " + req.url;
  console.log('⚡️ [express-session]: Session updated ->',req.session);
  next();
};
export default SetUserSession;