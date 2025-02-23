import { AppError } from "./common-models";
import * as Utils from "./common-utils";

type LogTypes = |"log"|"warn"|"error"|"info"|"ok"|"trace"|"reset"|"here"|"debug"|"maroon";
type ColorTypes = |"grey"|"red"|"green"|"yellow"|"blue"|"magenta"|"default"|"white";
type DefaultLogColors = Partial<Record<LogTypes,`\x1b[${number}m`|string>>;
const defaultLogColors:DefaultLogColors = {
  error:"\x1b[91m",//red
  ok:"\x1b[92m",//green
  warn:"\x1b[93m",//yellow
  info:"\x1b[94m",//blue
  trace:"\x1b[95m",//magenta
  log:"\x1b[96m",//cyan
  here:"\x1b[34m",//darkblue
  debug:"\x1b[38:5:214m",//orange
  reset:"\x1b[39m",//default
};
class ConsoleLogger {
  private static numOfLinesToDisgardInHere = 3;
  private static colors = defaultLogColors;
  /** Logger method to print the current filename & line number for debugging
   * 
   * @param silenceMsg - a boolean to turn off the"here" call
   * @returns string or void
   * 
   * - method will do nothing in production environments
   */
  private static here_ = ():{functionName:string,fileInfo:string} => {
    const e = new AppError("just for here");
    const stack = e.stack || "";
    const firstAt = stack.indexOf("at ");
    const realStack = stack.slice(firstAt);
    const stackArr = realStack.split("at ").map(s => s.trim()).slice(1);
    const here = stackArr[this.numOfLinesToDisgardInHere];
    const functionName = here.split("C:")[0].trim().replace(/[\s\(\)]+$/,"");
    const filepath = here.split("C:")[1].trim().replace(/[\s\(\)]+$/,"");
    if(!filepath) throw new AppError({status:500,info:here,message:"Logger failed!"});
    const filePathParts = filepath.split("\\");
    const fileInfo = "("+filePathParts[filePathParts.length - 1];//.replace(")","");
    return {functionName,fileInfo};
  };
  private static write = (k:LogTypes,...args:any[]):boolean => {
    try{
      const test = Utils.isEnv(["test"]);
      const verbose = Utils.isEnv("verbose");
      const okErrOrWarn = ["ok","error","warn"].includes(k);
      const iserror = k == "error";
      const isProd = Utils.isProd();
      const flag = `⚡️ [app-logger-${k}]:`;
      const {functionName,fileInfo} = this.here_();
      const color = this.colors[k];
      const reset = this.colors.reset;
      const log = console.log.bind(console,color,flag,reset);
      const logHere = log.bind(console,functionName,fileInfo);
      switch(true){
        case isProd && !iserror:break;
        // case !test && !okErrOrWarn:break; 
        case isProd && !iserror:break;
        case k == "here":
        case verbose:logHere(...args);break;
        default:log(...args);break;
      }
    }
    catch(e){console.error(e);}
    return true;
  };
  static print = (k:string,title:string,...args:any[]):boolean => {
    const isProd = Utils.isProd();
    const flag = `⚡️ [${title}]:`;
    const color = this.colors[k];
    const reset = this.colors.reset;
    const log = console.log.bind(console,color,flag,reset);
    if(!isProd) log(...args);
    return true;
  };
  static here = (silenceMsg?:boolean) => !silenceMsg?this.write("here"):null;
  static log = (...args:any[]) => this.write("log",...args);
  static info = (...args:any[]) => this.write("info",...args);
  static error = (...args:any[]) => this.write("error",...args);
  static warn = (...args:any[]) => this.write("warn",...args);
  static trace = (...args:any[]) => this.write("trace",...args);
  static ok = (...args:any[]) => this.write("ok",...args);
  static clear = () => process.stdout.write("\x1Bc");
}
export { ConsoleLogger as logger};