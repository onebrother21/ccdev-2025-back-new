export interface AppError extends IError {}
export class AppError extends Error {
  constructor(o:string|Partial<AppError>){
    const msg = typeof o === "string"?o:o.message;
    super(msg);
    Object.assign(this,o);
    return this;
  }
  json(){
    return {
      message:this.message,
      name:this.name,
      status:this.status,
      ...this.code?{code:this.code}:null,
      ...this.info?{info:this.info}:null,
      ...this.errors?{errors:this.errors}:null,
    };
  }
} 