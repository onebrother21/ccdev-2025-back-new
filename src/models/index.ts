import User from './user.model';
import Courier from './courier.model';
import Customer from './customer.model';
import Vendor from './vendor.model';
import Admin from './admin.model';
import Product from './product.model';
import Order from './order.model';
import Payment from "./payment.model";
import Task from './task.model';
import PokerPlan from './poker-plan.model';
import BusinessVars from './bvars.model';
import Notification from './notification.model';
import Message from './message.model';
import Chat from './chat.model';
import AuthToken,{DeadToken} from "./auth-token.model";
import {Channel,Artist,Comment,Reaction,ViewerLog} from "./livestream.model";

const Models = {
  User,
  Courier,
  Customer,
  Vendor,
  Admin,
  Product,
  Order,
  Task,
  PokerPlan,
  BusinessVars,
  Notification,
  Message,
  Chat,
  AuthToken,
  DeadToken,
  Payment,
  Channel,Artist,Comment,Reaction,ViewerLog,
};
export default Models;