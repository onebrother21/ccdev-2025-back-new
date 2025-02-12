import mongoose,{Schema,Model} from 'mongoose';
import * as AllTypes from "../types";

type BusinessVarsModel = Model<any>;

const bvars = new Schema({},{strict:false,timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
bvars.methods.json = function () {
  const json:Partial<AllTypes.IAdmin> =  {...this.toObject(),id:this.id};
  return json as AllTypes.IAdmin;
};
const BusinessVars = mongoose.model<any,BusinessVarsModel>('bvars',bvars);
export default BusinessVars;