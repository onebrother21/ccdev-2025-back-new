import { Document } from "mongoose";
import * as Profiles from "./profiles";
import * as Notes from "./note";

export enum ITaskStatuses {
  NEW = "new",
  ACTIVE = "active",
  INACTIVE = "inactive",
  COMPLETED = "completed",
  CLOSED = "closed",
  REOPENED = "reopened",
  CANCELLED = "cancelled",
  PROCESSED = "processing",
  IN_PROGRESS = "in-progress"
}
export type ITaskType = {
  createdOn:string|Date;
  updatedOn:string|Date;
  creator:Profiles.IProfiles;
  creatorRef:`${Profiles.IProfileTypes}s`;
  statusUpdates:Status<ITaskStatuses>[]; 
  status:ITaskStatuses; 
  dueOn:Date;
  category:string;
  type:string;
  name:string;
  description?:string;
  amt?:number;
  progress?:number;
  recurring?:boolean;
  recurringInterval?:string;
  tasks:ITask[];
  notes:Notes.INote[];
  resolution?:string;
  reason?:string;
  info:any;
};
export interface ITaskMethods {
  setStatus(name:ITaskStatuses,info?:any,save?:boolean):Promise<void>;
  preview():Pick<ITask,"id"|"name"|"category"|"type"|"description"|"status">;
  json():Partial<ITask>;
}
export interface ITask extends ITaskType,ITaskMethods,Document {}