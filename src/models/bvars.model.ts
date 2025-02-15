import mongoose,{Schema,Model} from 'mongoose';
import Types from "../types";

type BusinessVarsModel = Model<any>;

const bvars = new Schema({},{strict:false,timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
bvars.methods.json = function () {
  const json:Partial<Types.IAdmin> =  {...this.toObject(),id:this.id};
  return json as Types.IAdmin;
};
const BusinessVars = mongoose.model<any,BusinessVarsModel>('bvars',bvars);
export default BusinessVars;