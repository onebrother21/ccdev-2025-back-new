import Types from "../types";

export const SetUserSession:() => IHandler = () => (req,res,next) => {
  if(req.user){
    const {id,username,role} = req.user as Types.IUser;
    req.session.user = {id,username,role};
    req.session.pageViews = (req.session.pageViews || 0) + 1;
    req.session.lastAction = req.method.toLocaleUpperCase() + " " + req.url;
  }
  next();
};
export default SetUserSession;