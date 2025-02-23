import jwt from 'jsonwebtoken';
import Models from '../models';
import Utils from '../utils';
import Types from '../types';

const jwtSecret = process.env.JWT_KEY || "";
const auth:() => IHandler = () => async (req,res,next) => {
  try {
    const header = req.headers.authorization;
    const isTokenStr = header && header.includes("Bearer ");
    const parts = isTokenStr?header.split("Bearer "):[];
    const token = parts[1];
    if(token){
      const decoded = jwt.verify(token,jwtSecret) as Types.IAuthToken;
      if(decoded.type !== "access") throw new Utils.AppError(401,"Unauthorized!");
      const deadTkn = await Models.DeadToken.findOne({sub:decoded.sub});
      if(deadTkn) throw new Utils.AppError(401,"Unauthorized!");
      const user = await Models.User.findById(decoded.userId);
      if(!user || !user.profiles[decoded.role]) throw new Utils.AppError(401,"Unauthorized!");
      await user.populate(`profiles.${decoded.role}`);
      req.user = user as any;
      req.user.role = decoded.role;
      req.profile = user.profiles[decoded.role];
      req.token = decoded;
      next();
    }
    else throw new Utils.AppError(401,'Unauthorized');
  }
  catch(e){
    res.status(e.status || 400).send({
      success: false,
      message: 'Please Login.',
      error:e instanceof Utils.AppError?e.json():e
    });
  }
};
export default auth;