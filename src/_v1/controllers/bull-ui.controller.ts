import { User } from '../../models';
import { CommonUtils,logger,transStrings,createQueue } from '../../utils';
import * as AllTypes from "../../types";
import bcrypt from "bcryptjs";

const randomSleepQ = createQueue("random-sleep");
const scheduleNotificationsQ = createQueue("schedule-notifications");
const autoAssignCouriersQ = createQueue("auto-assign-couriers");

const CheckLogin:IHandler = async (req,res,next) => {
  if(!(req.session as any).user){
    console.log("no session user");
    res.redirect("/jobs/login");
  }
  else next();
};
const Logout:IHandler = async (req,res,next) => {
  const role = req.user.role;
  (req.session as any).user = null;
  console.log({onLogout:req.session})
  res.redirect('login');
};
const RenderLogin:IHandler = async (req,res,next) => res.render('login', { invalid: req.query.invalid === 'true' });
const Login:IHandler = async (req,res,next) => {
  console.log(req.body);
  const {username,pin,role} = req.body;
  if(!(username && pin)) res.redirect("/jobs/login?invalid=true");
  else {
    const user = await User.findOne({username});
    if (!user) {
      console.log("no user");
      (req.session as any).user = null;
      res.redirect("/jobs/login?invalid=true");
    }
    else {
      const compare = await bcrypt.compare(pin,user.pin);
      if(!compare) {
        console.log("bad pin");
        (req.session as any).user = null;
        res.redirect("/jobs/login?invalid=true");
      }
      else {
        await user.populate(`profiles.${role || "customer"}`);
        await user.save();
        (req.session as any).user = {id:user.id,username,role};
        (req.session as any).pageViews = ((req.session as any).pageViews || 0) + 1;
        (req.session as any).lastAction = req.method.toLocaleUpperCase() + " " + req.url;
        console.log({onLogin:req.session})
        res.redirect("/jobs");
      }
    }
  }
};
const PostJob:IHandler = async (req,res,next) => {
  const type = req.query.type;
  const opts:any = req.query.opts || {jobId:CommonUtils.shortId()};
  if(!(req.session as any).user) res.redirect("/jobs/login");
  else switch(type){
    case "doRandomSleep":{
      if (opts.delay) {opts.delay = +opts.delay * 1000;}
      await randomSleepQ.add('sleep-job', { title: req.query.title }, opts);
      res.json({success: true,message:`Random sleep processor added`});
      break;
    }
    case "scheduleNotifications":{
      if(opts.every){
        opts.every = +opts.every * 60 * 1000; // Convert minutes to milliseconds
        scheduleNotificationsQ.add('schedule-notifications-job',{},{repeat:{...opts}});
        res.json({success: true,message:`Notification processor on repeat every ${opts.every} ms.`});
      }
      break;
    }
    case "autoAssignCouriers":{
      if(opts.every){
        opts.every = +opts.every * 60 * 1000; // Convert minutes to milliseconds
        autoAssignCouriersQ.add('auto-assign-couriers-job',{},{repeat:{...opts}});
        res.json({success: true,message:`Auto assigning couriers on repeat every ${opts.every} ms.`});
      }
      break;
    }
  }
};

export {CheckLogin,Logout,RenderLogin,Login,PostJob};