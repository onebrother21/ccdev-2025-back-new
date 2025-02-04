import { Schema } from 'mongoose';
import * as AllTypes from "../types";
import CommonUtils from './common-utils';
import { stateAbbreviations } from './constants';

const ObjectId = Schema.Types.ObjectId;
const statusSchema = new Schema({
  name: { type: String,required:true},
  time: { type: Date,default:() => Date.now()},
  info: { type: Object},
},{_id:false,timestamps:false});

const getStatusSchema = <K extends string>(statuses:K[],defaultVal?:K) => {
  return new Schema({
    name: { type: String,enum:statuses,default:defaultVal || statuses[0]},
    time: { type: Date,default:() => Date.now()},
    info: { type: Object},
  } as any,{_id:false,timestamps:false}) as Schema<Status<K>>;
};
const getStatusArraySchema = <K extends string>(statuses:K[],defaultVal?:K) => {
  return {
    type:[
      new Schema({
        name: { type: String,enum:statuses},
        time: { type: Date,default:() => Date.now()},
        info: { type: Object},
      } as any,{_id:false,timestamps:false}) as Schema<Status<K>>
    ],
    default:() => statuses.length?[{name:defaultVal || statuses[0],time:new Date()}]:[]
  };
};
const getNoteSchema = () => {
  return new Schema<AllTypes.INote>({
    user:{ type:ObjectId,refPath:"userRef",required:true },
    userRef:{ type:String,enum:Object.values(AllTypes.IProfileTypes),required:true },
    msg: { type: String,required:true},
    time: { type: Date,default:() => new Date()},
    slug: { type: String,default:() => CommonUtils.shortId()},
  },{_id:false,timestamps:false});
};
const getNoteArraySchema = () => {
  return {
    type:[
      new Schema<AllTypes.INote>({
        user:{ type:ObjectId,ref:"users",required:true },
        msg: { type: String,required:true},
        time: { type: Date,default:() => new Date()},
        slug: { type: String,default:() => CommonUtils.shortId()},
      },{_id:false,timestamps:false})
    ],
    default:() => []
  };
};

const getAddressSchema = () => {
  return new Schema<AddressObj>({
    streetAddr: { type: String,required:true,validate:/^\d+\s[\w\s,\.]+$/},
    city: { type: String,required:true},
    state: { type: String,required:true,enum:[...stateAbbreviations]},
    postal: { type: String,required:true},
    country: { type: String,required:true},
  },{_id:false,timestamps:false});
};
const getLicenseSchema = () => {
  return new Schema<AllTypes.ILicenseInfo>({
    num: { type: String,required:true,validate:/^[0-9]{8,10}$/},
    state: { type: String,required:true,enum:[...stateAbbreviations]},
    expires: { type: Date,required:true},
  },{_id:false,timestamps:false});
}

export { statusSchema,getStatusSchema,getStatusArraySchema,getNoteArraySchema,getAddressSchema,getLicenseSchema };

