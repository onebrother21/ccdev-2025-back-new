import mongoose,{Schema,Model} from 'mongoose';
import * as AllTypes from "../types";
import { getStatusArraySchema } from '../utils';

type ChatModel = Model<AllTypes.IChat,{},AllTypes.IChatMethods>;
const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema<AllTypes.IChat,ChatModel,AllTypes.IChatMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.IChatStatuses),AllTypes.IChatStatuses.ACTIVE),
  status:{type:String,default:AllTypes.IChatStatuses.ACTIVE},
  type: {
    type: String,
    enum:["user-chat","service-chat"],
    required: true
  },
  participants: [{ type: Schema.Types.ObjectId, required: true, refPath: 'participantRefs' }],
  participantRefs: [{ type: String, required: true, enum: Object.values(AllTypes.IProfileTypes) }],
  messages: [{ type: ObjectId, ref: 'messages' }],
  lastMessage: { type: ObjectId, ref: 'messages' },
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

chatSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
chatSchema.methods.json = function () {
  const json:Partial<AllTypes.IChat> =  {};
  json.id = this.id;
  json.type = this.type;
  json.participants = this.participants.map(o => o.json() as any);
  json.participantRefs = this.participantRefs;
  json.messages = this.messages.map(o => o.json() as any);
  json.lastMessage = this.lastMessage.json() as any;
  json.status = this.status;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.IChat;
};

const Chat = mongoose.model<AllTypes.IChat,ChatModel>('chats',chatSchema);
export default Chat;