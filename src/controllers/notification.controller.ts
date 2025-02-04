import { Notification } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';
import * as AllTypes from "../types";

const CreateNotification:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const notification = new Notification({...data});
  try {
    await notification.save();
    //await notification.populate(`creator notes.user tasks`);
    res.locals = {
      status:201,
      success:true,
      data:notification.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
export {
  CreateNotification,
};