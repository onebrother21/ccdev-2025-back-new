import mongoose,{Schema,Model} from 'mongoose';
import * as AllTypes from "../types";
import { getStatusArraySchema } from '../utils';

type MessageModel = Model<AllTypes.IMessage,{},AllTypes.IMessageMethods>;
const ObjectId = Schema.Types.ObjectId;

const reactionSchema = new Schema({
  user: { type: ObjectId, refPath: 'userRef', required: true },
  userRef: { type: String, enum: Object.values(AllTypes.IProfileTypes),required: true },
  reaction: { type: String, required: true },
  time: { type: Date, default: Date.now },
},{_id:false,timestamps:false});

const messageSchema = new Schema<AllTypes.IMessage,MessageModel,AllTypes.IMessageMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.IMessageStatuses),AllTypes.IMessageStatuses.SAVED),
  status:{type:String,default:AllTypes.IMessageStatuses.SAVED},
  chat: { type: ObjectId, ref: 'chats', required: true },
  sender: { type: ObjectId, refPath: 'senderRef', required: true },
  senderRef: { type: String, enum: Object.values(AllTypes.IProfileTypes), required: true },
  content: { type: String, required: true },
  readBy: [{ type: ObjectId, refPath: 'readyByRefs', required: true }],
  readByRefs: [{ type: String, enum: Object.values(AllTypes.IProfileTypes) }],
  reactions: [reactionSchema],
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

messageSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
messageSchema.methods.json = function () {
  const json:Partial<AllTypes.IMessage> =  {};
  json.id = this.id;
  json.chat = this.chat.id || this.chat;
  json.sender = this.sender.json() as any;
  json.content = this.content;
  json.status = this.status;
  json.readBy = this.readBy;
  json.reactions = this.reactions.map(o => ({...o,user:o.user.json()})) as AllTypes.IMessage["reactions"];
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.IMessage;
};

const Message = mongoose.model<AllTypes.IMessage,MessageModel>('messages',messageSchema);
export default Message;