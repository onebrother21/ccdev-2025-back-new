import * as Profiles from "./profiles";

export type IPin = `${Digit}${Digit}${Digit}${Digit}`;
export type IAuthTokenInit = {
  type:"access"|"refresh"|"reset"|"stream";
  id:string;
  role:Profiles.IProfileTypes;
  sub:string;
};
export type IAuthToken = IAuthTokenInit & {exp:any;iat:any;};
export type IAuthEvents = "created"|"registered"|"verified"|"loggedout"|"loggedin"|"reset"|"updated";
export type IAuthActivity = Partial<Record<IAuthEvents,string|Date>>;
export type IAuthParams = {
  pin:IPin;
  reset:string|null;
  verification:string|null;
  verificationSent:Date;
  pushToken:string|null;
  socketId:string|null;
  // token:AuthToken|null;
  // scopes:string[];
  // activity:AuthActivity;
};