import mongoose,{Schema,Model} from 'mongoose';
import * as AllTypes from "../types";

type BusinessVarsModel = Model<any>;

const bvars = new Schema({},{strict:false,timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

bvars.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
bvars.methods.json = function () {
  const json:Partial<AllTypes.IAdmin> =  {...this.toObject(),id:this.id};
  return json as AllTypes.IAdmin;
};
const BusinessVars = mongoose.model<any,BusinessVarsModel>('bvars',bvars);
export default BusinessVars;