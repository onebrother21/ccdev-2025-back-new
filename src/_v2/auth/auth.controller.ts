import { AuthService } from './auth.service';
import Utils from '../../utils';
import Types from "../../types";

export class AuthController {
  static SignUp:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.message = 'User signup successfully',
      res.locals.data = await AuthService.signupUser(req.body.data);
      next();
    } catch(e){ next(e); }
  };
  static VerifyEmail:IHandler = async (req,res,next) => {
    try{
      res.locals.success = true,
      res.locals.data = await AuthService.verifyUser(req.body.data);
      next();
    } catch(e){ next(e); }
  };
  static Register:IHandler = async (req,res,next) => {
    try {
      const {user,role,accessToken,refreshToken} = await AuthService.registerUser(req.body.data);
      res.locals.status = 201,
      res.locals.success = true,
      res.locals.message = req.t(Utils.transStrings.registeredsuccessfully, {name: user.name.first}),
      res.locals.data = user.json(role,true),
      res.locals.token = {accessToken,refreshToken};
      req.user = user;
      next();
    } catch(e){ next(e); }
  };
  static Login:IHandler = async (req,res,next) => {
    try {
      const {user,role,accessToken,refreshToken} = await AuthService.loginUser(req.body.data);
      res.locals.success = true;
      res.locals.data = user.json(role,true);
      res.locals.token = {accessToken,refreshToken};
      req.user = user;
      next();
    } catch(e){ next(e); }
  };
  static LoginRefreshToken:IHandler = async (req,res,next) => {
    try {
      const {user,role,accessToken,refreshToken} = await AuthService.refreshAuthToken(req.body);
      req.user = user;
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      res.locals.token = {accessToken,refreshToken};
      req.user = user;
      next();
    } catch(e){ next(e); }
  };
  static Logout:IHandler = async (req,res,next) => {
    try {
      await AuthService.logoutUser(req.user.id,res.locals.tokenStub);
      res.locals.success = true,
      res.locals.message = 'Logout successful';
      next();
    } catch(e){ next(e); }
  };
  static RequestPasswordReset:IHandler = async (req,res,next) => {
    try {
      const {ok} = await AuthService.initiatePasswordReset(req.body.data);
      res.locals.success = ok,
      res.locals.message = 'Password reset email sent';
      next();
    } catch(e){ next(e); }
  };
  static ResetPassword:IHandler = async (req,res,next) => {
    try {
      await AuthService.resetPassword(req.body.data);
      res.locals.success = true,
      res.locals.message =  'Password successfully reset';
      next();
    } catch(e){ next(e); }
  };
  static Update:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await AuthService.updateUser(user_,req.body.data);
      res.locals.success = true;
      res.locals.message = req.t(Utils.transStrings.profileupdatedsuccessfuly),
      res.locals.data = user.profiles[role].json();
      next();
    } catch(e){ next(e); }
  };
  static SwitchProfile:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const { role } = req.body.data;
    try {
      const {user,accessToken,refreshToken} = await AuthService.switchUserProfile(role,user_);
      res.locals.success = true;
      res.locals.token = {accessToken,refreshToken};
      res.locals.data = user.profiles[role].json();
      next();
    } catch(e){ next(e); }
  };
  static AddProfile:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await AuthService.addUserProfile(role,user_);
      res.locals.success = true,
      res.locals.message = req.t(Utils.transStrings.registeredsuccessfully, {name: user.name.first}),
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static UpdateProfile:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await AuthService.updateUserProfile(role,user_,req.body.data);
      res.locals.success = true,
      res.locals.message = req.t(Utils.transStrings.registeredsuccessfully, {name: user.name.first})
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static Auto:IHandler = async (req,res,next) => {
    const user = req.user as Types.IUser;
    const role = user.role as Types.IProfileTypes;
    try {
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
}
export default AuthController;