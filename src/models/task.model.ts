import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { getStatusArraySchema, noteSchema } from "../utils";
import * as AllTypes from "../types";

type TaskModel = Model<AllTypes.ITask,{},AllTypes.ITaskMethods>;
const ObjectId = Schema.Types.ObjectId;

const taskSchema = new Schema<AllTypes.ITask,TaskModel,AllTypes.ITaskMethods>({
  statusUpdates:getStatusArraySchema(Object.values(AllTypes.ITaskStatuses),AllTypes.ITaskStatuses.NEW),
  creator:{type:ObjectId,ref:"users",required:true},
  category: { type: String,required:true},
  type: { type: String,required:true},
  name: { type: String,required:true},
  description: { type: String,maxlength:140 },
  recurring:{type:Boolean},
  recurringInterval:{type:String,enum:["wk","2wk","3wk","m","3m","6m","yr"]},
  amt:{type:Number},
  dueOn:{type:Date,required:true},
  progress:{type:Number,min:0,max:100,default:() => 0},
  resolution:{ type: String,maxlength:140},
  reason:{ type: String},
  tasks:[{type:ObjectId,ref:"tasks"}],
  notes:[noteSchema],
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
taskSchema.plugin(uniqueValidator);
taskSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
taskSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
taskSchema.methods.preview = function () {
  return {
    id:this._id.toString(),
    category:this.category,
    type:this.type,
    name:this.name,
    description:this.description,
    status:this.status,
  };
};
taskSchema.methods.json = function () {
  const json:Partial<AllTypes.ITask> =  {};
  json.id = this._id.toString();
  json.creator = this.creator.json() as any,
  json.category = this.category;
  json.type = this.type;
  json.name = this.name;
  json.description = this.description;
  json.recurring = this.recurring;
  json.recurringInterval = this.recurringInterval;
  json.amt = this.amt;
  json.tasks = this.tasks.map(o => o.preview() as AllTypes.ITask);
  json.notes = this.notes.map(o => o.json()) as AllTypes.INote[];
  json.status = this.status;
  json.progress = this.progress;
  json.resolution = this.resolution;
  json.reason = this.reason;
  json.dueOn = this.dueOn;
  json.info = this.info;
  json.createdOn = this.createdOn;
  return json as AllTypes.ITask;
};

const Task = mongoose.model<AllTypes.ITask,TaskModel>('tasks',taskSchema);
export default Task;