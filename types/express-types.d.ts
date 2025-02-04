interface IRequest extends Request_ {
  userId:string;
  user:IAppCreds;
  token:string;
  session:any;
  bvars:any;
  device:any;
}
type IHandler = (req:IRequest, res:Response_, next:Next_) => void|Promise<void>;
type IErrorHandler = (err:Error, req:IRequest, res:Response_, next:Next_) => void;