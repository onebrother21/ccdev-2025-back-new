import mongoose,{Schema,Model} from 'mongoose';
import Types from 'types';

type AuthTokenModel = Model<Types.IAuthToken>;

const authToken = new Schema({},{strict:false,timestamps:false});
const AuthToken = mongoose.model<Types.IAuthToken,AuthTokenModel>('authToken',authToken);
export default AuthToken;


type DeadTokenModel = Model<Types.IAuthToken>;
const deadToken = new Schema({},{strict:false,timestamps:false});
const DeadToken = mongoose.model<Types.IAuthToken,DeadTokenModel>('deadToken',deadToken);

export { AuthToken,DeadToken };