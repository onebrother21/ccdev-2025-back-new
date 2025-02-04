import mongoose,{Schema,Model} from 'mongoose';
import * as AllTypes from "../types";
import { getStatusArraySchema } from '../utils';

type NotificationModel = Model<AllTypes.INotification,{},AllTypes.INotificationMethods>;
const ObjectId = Schema.Types.ObjectId;

const notificationSchema = new Schema<AllTypes.INotification,NotificationModel,AllTypes.INotificationMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.INotificationStatuses),AllTypes.INotificationStatuses.NEW),
  status:{type:String,default:AllTypes.INotificationStatuses.NEW},
  type: {type: String,enum:Object.keys(AllTypes.INotificationTemplates),required: true},
  audience: [{ type:ObjectId, ref: "users", required: true }],
  method: {type: String,enum: Object.values(AllTypes.INotificationSendMethods),required:true},
  job: { type: String },
  meta: { type: Schema.Types.Mixed },
  retries: { type: Number, default: () => 0 },
  data: { type: Schema.Types.Mixed }, // Store any data for personalization
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

notificationSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
notificationSchema.methods.json = function () {
  const json:Partial<AllTypes.INotification> =  {};
  json.id = this.id;
  json.method = this.method;
  json.audience = this.audience;
  json.type = this.type;
  json.status = this.status;
  json.retries = this.retries;
  json.job = this.job;
  json.data = this.data;
  json.meta = this.meta;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.INotification;
};

const Notification = mongoose.model<AllTypes.INotification,NotificationModel>('notifications',notificationSchema);
export default Notification;