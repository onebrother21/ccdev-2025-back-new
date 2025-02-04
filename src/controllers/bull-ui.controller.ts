import { User } from '../models';
import bcrypt from "bcryptjs";
import MyWorkers from '../workers';

const workers = new MyWorkers();

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
  if(!(req.session as any).user){
    console.log({onPost:req.session})
    res.redirect("/jobs/login");
  }
  else switch(req.query.type){
    case "doRandomSleep":{
      const opts:any = req.query.opts || {};
      if (opts.delay) {opts.delay = +opts.delay * 1000;}
      await workers.queues.doRandomSleep.add('sleep-job', { title: req.query.title }, opts);
      break;
    }
    case "scheduleNotifications":{
      const opts:any = req.query.opts || {};
      if (opts.every) opts.every = +opts.every * 60 * 1000; // Convert minutes to milliseconds
      await workers.queues.scheduleNotifications.add('schedule-notifications-job',{},{repeat:{...opts}});
      console.log(`Notification processing on repeat every ${opts.every} minutes.`);
      break;
    }
  }
  res.json({ok: true});
};

export {CheckLogin,Logout,RenderLogin,Login,PostJob};