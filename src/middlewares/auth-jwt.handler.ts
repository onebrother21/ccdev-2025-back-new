import jwt from 'jsonwebtoken';
import Models from '../models';
import Utils from '../utils';
import Types from 'types';

const jwtSecret = process.env.JWT_KEY || "";
const auth:IHandler = async (req,res,next) => {
  try {
    const header = req.headers.authorization;
    const isTokenStr = header && header.includes("Bearer ");
    const parts = isTokenStr?header.split("Bearer "):[];
    const token = parts[1];
    if(token){
      const decoded = jwt.verify(token,jwtSecret) as Types.IAuthToken;
      const user = await Models.User.findById(decoded.id);
      Utils.logger.log(decoded);
      if(!user) throw new Utils.AppError(401,"Unauthorized!");
      await user.populate(`profiles.${decoded.role}`);
      res.locals.tokenStub = decoded.sub;
      req.user = user;
      req.user.role = decoded.role;
      req.profile = user.profiles[decoded.role];
      req.token = token;
      next();
    }
    else throw new Utils.AppError(401,'Unauthorized');
  }
  catch(e){
    res.status(400).send({
      success: false,
      message: 'Please, Login.',
      error:e
    });
  }
};
export default auth;