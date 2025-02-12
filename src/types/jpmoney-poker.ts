import { Document } from "mongoose";
import * as Profiles from "./profiles";
import * as Notes from "./note";

export enum IPokerPlanStatuses  {
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
export type IPokerVenue = AddressObj & {name:string,desc?:string};
export type IPokerEntry = {
  type:"cash"|"tourney";
  start:Date;
  arrival:Date;
  desc:string;
  venue:IPokerVenue;
  payments:Status<string>[];
  players:number;
  results:number|"dnp"|"cash";
  images:string[];
  notes:Notes.INote[];
};
export type IPokerPlanType = {
  creator:Profiles.IAdmin|Profiles.ICustomer;
  creatorRef:`${Profiles.IProfileTypes}s`;
  createdOn:Date
  updatedOn:Date
  published:Date
  name:string
  motto?:string
  bio?:string
  desc?:string
  statusUpdates:Status<IPokerPlanStatuses>[]; 
  status:IPokerPlanStatuses; 
  startDate:Date
  startBal:number
  endDate:Date
  endBal:number
  venues:IPokerVenue[];
  entries:IPokerEntry[];
  params:{
    expPlayRate:"wk"|"2wk"|"3wk"|"mo"|"3mo"|"6mo"|"yr"
    expCTTRatio:number
    expHitRate:number
    expReturn:number
    stdError:number
  };
  info:any;
};
export interface IPokerPlanMethods {
  setStatus(name:IPokerPlanStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IPokerPlan>;
}
export interface IPokerPlan extends IPokerPlanType,IPokerPlanMethods,Document {}


export type PokerPlanQueryStringKeys = |"creator.username"|"creator.fullname"|"creator.location"|"status.name"|"desc";
export type PokerPlanQueryNumberKeys = |"startBal"|"endBal";
export type PokerPlanQueryDateKeys = "createdAt"|"published"|"startDate"|"endDate";
export type PokerPlanQuery =
Partial<Record<PokerPlanQueryStringKeys,string>> & 
Partial<Record<PokerPlanQueryNumberKeys,Partial<Record<"eq"|"ne"|"min"|"max",Date>>>> &  
Partial<Record<PokerPlanQueryDateKeys,Partial<Record<"eq"|"ne"|"min"|"max",Date>>>>;
export type PokerPlanInfoKeys = |"name"|"bio"|"motto"|"startDate"|"startBal"|"endDate"|"endBal"|"entries";