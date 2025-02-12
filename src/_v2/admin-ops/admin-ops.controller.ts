import { AdminOpsService } from './admin-ops.service';
import * as AllTypes from "../../types";

export class AdminOpsController {
  static PostJob:IHandler = async (req,res,next) => {
    try {
      const user = req.user as AllTypes.IUser;
      const {message} = await AdminOpsService.postJob(user,req.body.data);
      res.locals.status = 201,
      res.locals.success = true,
      res.locals.message = message,
      res.locals.data = {ok:true};
      next();
    } catch(e){ next(e); }
  }
}
export default AdminOpsController;