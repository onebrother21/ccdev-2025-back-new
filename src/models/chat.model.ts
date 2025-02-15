import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const chatSchema = new Schema<Types.IChat,Chat,Types.IChatMethods>({
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IChatStatuses),Types.IChatStatuses.ACTIVE),
  type: {
    type: String,
    enum:["user-chat","service-chat"],
    required: true
  },
  participants: [{ type: Schema.Types.ObjectId, required: true, refPath: 'participantRefs' }],
  participantRefs: [{ type: String, required: true, enum: Object.values(Types.IProfileTypes) }],
  messages: [{ type: ObjectId, ref: 'messages' }],
  lastMessage: { type: ObjectId, ref: 'messages' },
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

chatSchema.plugin(uniqueValidator);
chatSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
chatSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  this.status = status.name;
  if(save) await this.save();
};
chatSchema.methods.json = function () {
  const json:Partial<Types.IChat> =  {};
  json.id = this.id;
  json.type = this.type;
  json.participants = this.participants.map(o => o.json() as any);
  json.participantRefs = this.participantRefs;
  json.messages = this.messages.map(o => o.json() as any);
  json.lastMessage = this.lastMessage.json() as any;
  json.status = this.status;
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.IChat;
};

type Chat = Model<Types.IChat,{},Types.IChatMethods>;
const Chat:Chat = mongoose.model<Types.IChat>('chats',chatSchema);
export default Chat;