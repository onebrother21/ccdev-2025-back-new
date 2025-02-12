import jwt from 'jsonwebtoken';
import { User } from '../models';
import { logger } from '../utils';

const jwtSecret = process.env.JWT_KEY || "";
const auth:IHandler = async (req,res,next) => {
  try {
    const header = req.headers.authorization;
    const isTokenStr = header && header.includes("Bearer ");
    const parts = isTokenStr?header.split("Bearer "):[];
    const token = parts[1];
    if(token){
      const decoded = jwt.verify(token,jwtSecret) as IAppCreds & {expires:string|number|Date};
      const user = await User.findById(decoded.id);
      await user.populate(`profiles.${decoded.role}`);
      res.locals.tokenExp = decoded.expires;
      req.user = user;
      req.user.role = decoded.role;
      req.profile = user.profiles[decoded.role];
      req.token = token;
      next();
    }
    else res.status(401).send({success: false,message: 'Unauthorized'});
  }
  catch(e){
    e.message = 'Please, Login.';
    res.status(403).send({
      success: false,
      message: 'Please, Login.',
    });
  }
};
export default auth;