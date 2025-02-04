import mongoose,{Schema,Model} from 'mongoose';
import { getStatusArraySchema,getNoteArraySchema,stateAbbreviations  } from '../utils';
import * as AllTypes from "../types";

type PokerPlanModel = Model<AllTypes.IPokerPlan,{},AllTypes.IPokerPlanMethods>;
const ObjectId = Schema.Types.ObjectId;

const venueSchema = new Schema<AllTypes.IPokerVenue>({
  name: { type: String,required:true},
  streetAddr: { type: String,required:true},
  city: { type: String,required:true},
  state: { type: String,required:true,enum:[...stateAbbreviations]},
  postal: { type: String,required:true},
  country: { type: String,required:true},
  desc:{type:String,maxlength:140},
},{_id:false,timestamps:false});
const entrySchema = new Schema<AllTypes.IPokerEntry>({
  payments:getStatusArraySchema([]),
  type: { type: String,required:true},
  start: { type: Date,required:true},
  arrival: { type: Date },
  desc: { type: String,maxlength:140 },
  venue:venueSchema,
  results:{type:Schema.Types.Mixed,default:null},
  images:[String],
  notes:getNoteArraySchema(),
},{_id:false,timestamps:false});
const paramsSchema = new Schema<AllTypes.IPokerPlan["params"]>({
  expPlayRate: { type: String,required:true,enum:["wk","2wk","3wk","mo","3mo","6mo","yr"]},
  expCTTRatio: { type: Number,required:true},
  expHitRate: { type: Number,required:true},
  expReturn: { type: Number,required:true},
  stdError: { type: Number,required:true},
},{_id:false,timestamps:false});


const pokerPlanSchema = new Schema<AllTypes.IPokerPlan,PokerPlanModel,AllTypes.IPokerPlanMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.IPokerPlanStatuses),AllTypes.IPokerPlanStatuses.NEW),
  status:{type:String,default:AllTypes.IPokerPlanStatuses.NEW},
  creator:{type:ObjectId,ref:"users"},
  name:{ type: String,required:true},
  motto: { type: String},
  bio: { type: String,maxlength:140},
  desc: { type: String},
  startDate:{ type: Date,required:true},
  startBal: { type: Number,default:0 },
  endDate: { type: Date,required:true},
  endBal: { type: Number },
  venues:[venueSchema],
  entries:[entrySchema],
  params:paramsSchema,
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

pokerPlanSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
pokerPlanSchema.methods.json = function () {
  const json:Partial<AllTypes.IPokerPlan> =  {};
  json.id = this._id.toString();
  json.creator = this.creator.json() as any,
  json.name = this.name;
  json.motto = this.motto;
  json.bio = this.bio;
  json.desc = this.desc;
  json.status = this.status;
  json.startDate = this.startDate;
  json.startBal = this.startBal;
  json.endDate = this.endDate;
  json.endBal = this.endBal;
  json.venues = this.venues;
  json.entries = this.entries;
  json.params = this.params;
  json.published = this.createdOn;
  json.updatedOn = this.updatedOn;
  return json as AllTypes.IPokerPlan;
};

const PokerPlan = mongoose.model<AllTypes.IPokerPlan,PokerPlanModel>('pokerPlans',pokerPlanSchema);
export default PokerPlan;