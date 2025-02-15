import mongoose,{ConnectOptions} from 'mongoose';
import bluebird from 'bluebird';
import Utils from '../utils';

class Db {
  /**
 * @param config - An object that expects the mongo_uri path
 * @returns Returns the mongo connection
 */
  public static connect = async (uri:string,opts?:ConnectOptions) => {
    try {
      (<any>mongoose).Promise = bluebird;
      await mongoose.connect(uri,opts);
      Utils.logger.print("debug","db","DB (mongodb) is running");
    }
    catch(e){
      Utils.logger.error(`MongoDB connection error. ${e}`);
      process.exit(1);
    }
  };
}
export default Db;