import mongoose,{Schema,Model} from 'mongoose';

type AuthTokenModel = Model<any>;

const authToken = new Schema({},{strict:false,timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
const AuthToken = mongoose.model<any,AuthTokenModel>('authToken',authToken);
export default AuthToken;


type DeadTokenModel = Model<any>;
const deadToken = new Schema({stub:{type:String,required:true}},{strict:false,timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
const DeadToken = mongoose.model<any,AuthTokenModel>('deadToken',deadToken);

export { DeadToken };