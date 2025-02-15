import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const reactionSchema = new Schema({
  user: { type: ObjectId, refPath: 'userRef', required: true },
  userRef: { type: String, enum: Object.values(Types.IProfileTypes),required: true },
  reaction: { type: String, required: true },
  time: { type: Date, default: Date.now },
},{_id:false,timestamps:false});

const messageSchema = new Schema<Types.IMessage,Message,Types.IMessageMethods>({
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IMessageStatuses),Types.IMessageStatuses.SAVED),
  chat: { type: ObjectId, ref: 'chats', required: true },
  sender: { type: ObjectId, refPath: 'senderRef', required: true },
  senderRef: { type: String, enum: Object.values(Types.IProfileTypes), required: true },
  content: { type: String, required: true },
  readBy: [{ type: ObjectId, refPath: 'readyByRefs', required: true }],
  readByRefs: [{ type: String, enum: Object.values(Types.IProfileTypes) }],
  reactions: [reactionSchema],
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

messageSchema.plugin(uniqueValidator);
messageSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
messageSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  this.status = status.name;
  if(save) await this.save();
};
messageSchema.methods.json = function () {
  const json:Partial<Types.IMessage> =  {};
  json.id = this.id;
  json.chat = this.chat.id || this.chat;
  json.sender = this.sender.json() as any;
  json.content = this.content;
  json.status = this.status;
  json.readBy = this.readBy;
  json.reactions = this.reactions.map(o => ({...o,user:o.user.json()})) as Types.IMessage["reactions"];
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.IMessage;
};

type Message = Model<Types.IMessage,{},Types.IMessageMethods>;
const Message:Message = mongoose.model<Types.IMessage>('messages',messageSchema);
export default Message;