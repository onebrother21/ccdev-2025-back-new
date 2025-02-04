type Digit = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9";
type Constructor<T> = new (...args:any[]) => T;
type DeepPartial<T> = {[P in keyof T]?:DeepPartial<T[P]>;};
type DeepPartialExcept<T,K extends keyof T> = DeepPartial<T> & Pick<T,K>;

type AnyBoolean = boolean|1|0|null;
type Nullable<T> = T|null;
type Newable<T> = { new (...args: any[]): T; };
type Keys<T> = Extract<keyof T,string>;
type Values<T> = {[k in keyof T]:T[k]}[keyof T];
type Primitive = string|number|boolean|Date|Error;
type PrimitiveArr = Primitive[];
interface Primitives {[key:string]:Primitive|PrimitiveArr|Primitives|Primitives[];}
type DataMap<T> = {[key:string]:T};
type Enum<T,K extends string|undefined = undefined,J extends string|undefined = undefined> =
(K extends string?Record<K,T>:DataMap<T>) &
(J extends string?Partial<Record<J,T>>:{});
type Strings<K extends string|undefined = undefined> = Enum<string,K>;
type Numbers<K extends string|undefined = undefined> = Enum<number,K>;
type Bools<K extends string|undefined = undefined> = Enum<boolean,K>;
type Method<T> = (...params:any[]) => T;
type Methods<T> = DataMap<Method<T>>;
type TypedMethod<T,U> = (...params:(T|any)[]) => U;
type TypedMethods<T,U> = DataMap<TypedMethod<T,U>>;
type LocaleDateOpts = Record<"weekday"|"month"|"day"|"year"|"hour"|"minute"|"second",string> & {hour12?:boolean;};

type Entity = {
  id:string;
  cid:string;
  creator:"_self_"|string;
  createdOn:string|Date;
  updatedOn?:string|Date;
  removedOn?:string|Date;
  desc?:string;
  info?:MiscInfo;
  meta?:MiscInfo;
};
type Collection<T,K extends string = ""> = {
  new:Partial<T>;
  items:{[k in K]:T[]};
  selected:Nullable<{id:string;i:number;item:T}>;
};
type DeletedEntity = {id:string;ok:AnyBoolean;};

type ReqValidationError = {msg:string;param:string;location:string;};
type ValidationErrors = {errors:ReqValidationError[]|Primitives};
type ErrorConfig = Partial<{
  type:string;
  message:string;
  msg:string;
  status:number;
  code:number|string;
  warning:boolean;
  src:string;
  info:MiscInfo;
} & ValidationErrors>;
type ErrorObj = Error & ErrorConfig & Entity;
type ErrorType = Error|ErrorObj|ValidationErrors;
type Errors<K extends string|undefined = undefined> = Enum<ErrorType,K>;

type MiscInfo = Primitives;
type Status<K extends string> = {name:K;time:string|Date;info?:MiscInfo;};
type HrsOfOperation = `${number}${"am"|"pm"} - ${number}${"am"|"pm"}`;
type PhoneNumber = `+${number}-${number}-${number}-${number}`;
type ZipCode = `${number}`;

type LocationStr = `${string}/${string}/${string}/${string}/${string}/${ZipCode}/${string}`;
type LocationObj = Record<"city"|"state"|"country",string> & Partial<Record<"address"|"zip"|"phn"|"name"|"desc",string>>;
type AddressObj = Record<"streetAddr"|"city"|"state"|"postal"|"country",string>;

type LocationData = Partial<{
  str:LocationStr;
  obj:LocationObj;
  coords:[number,number];
}>;
type MiscModelRef = {id:string;ref:string;};