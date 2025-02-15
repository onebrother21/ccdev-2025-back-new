import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const venueSchema = new Schema<Types.IPokerVenue>({
  name: { type: String,required:true},
  streetAddr: { type: String,required:true},
  city: { type: String,required:true},
  state: { type: String,required:true,enum:[...Utils.stateAbbreviations]},
  postal: { type: String,required:true},
  country: { type: String,required:true},
  desc:{type:String,maxlength:140},
},{_id:false,timestamps:false});
const entrySchema = new Schema<Types.IPokerEntry>({
  payments:Utils.getStatusArraySchema([]),
  type: { type: String,required:true},
  start: { type: Date,required:true},
  arrival: { type: Date },
  desc: { type: String,maxlength:140 },
  venue:venueSchema,
  results:{type:Schema.Types.Mixed,default:null},
  images:[String],
  notes:[Utils.noteSchema],
},{_id:false,timestamps:false});
const paramsSchema = new Schema<Types.IPokerPlan["params"]>({
  expPlayRate: { type: String,required:true,enum:["wk","2wk","3wk","mo","3mo","6mo","yr"]},
  expCTTRatio: { type: Number,required:true},
  expHitRate: { type: Number,required:true},
  expReturn: { type: Number,required:true},
  stdError: { type: Number,required:true},
},{_id:false,timestamps:false});

const pokerPlanSchema = new Schema<Types.IPokerPlan,PokerPlan,Types.IPokerPlanMethods>({
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IPokerPlanStatuses),Types.IPokerPlanStatuses.NEW),
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
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
pokerPlanSchema.plugin(uniqueValidator);
pokerPlanSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
pokerPlanSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
pokerPlanSchema.methods.json = function () {
  const json:Partial<Types.IPokerPlan> =  {};
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
  json.entries = this.entries.map(o => ({...o,notes:o.notes.map(n => n.json())})) as any[];
  json.params = this.params;
  json.info = this.info;
  json.published = this.createdOn;
  json.updatedOn = this.updatedOn;
  return json as Types.IPokerPlan;
};


type PokerPlan = Model<Types.IPokerPlan,{},Types.IPokerPlanMethods>;
const PokerPlan:PokerPlan = mongoose.model<Types.IPokerPlan>('pokerPlans',pokerPlanSchema);
export default PokerPlan;