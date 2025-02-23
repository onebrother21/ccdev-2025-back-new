import { Document } from "mongoose";
import {
  IAdmin,
  ICourier,
  ICustomer,
  IVendor,
  IArtist,
  IProfileModelNames,
  IContentReport,
} from './profiles';
import { IUser } from "./user.types";

// Enums
export enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  FIRE = "fire",
  CLAP = "clap",
}
// Comment Interface & Schema
export interface ICommentType {
  user:ICustomer|IArtist; // Reference to User
  channel:IChannel; // Reference to Channel
  text: string;
  createdAt: Date;
  replies:IComment[];
  reports:IContentReport[];
  status:"reported"|"new"|"active"|"removed";
}

export interface ICommentMethods {
  //setStatus(name:ICommentStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IComment>;
}
export interface IComment extends ICommentType,ICommentMethods,Document {}
// Reaction Interface & Schema
export interface IReactionType {
  user:ICustomer;
  channel:IChannel;
  type: ReactionType;
  createdAt: Date;
}

export interface IReactionMethods {
  //setStatus(name:IReactionStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IReaction>;
}
export interface IReaction extends IReactionType,IReactionMethods,Document {}
// Channel Interface & Schema
export interface IChannelType {
  title: string;
  description?: string;
  videoUrl: string; // URL to live stream or recorded video
  thumbnailUrl?: string;
  genre: string;
  featuredArtists:IArtist[]; // References to Artist
  startTime: Date;
  endTime: Date;
  isLive: boolean;
  viewerCt:number;
  comments: IComment[]; // References to Comments
  reactions:IReaction[]; // References to Reactions
  reports:IContentReport[];
  status:"is-live"|"completed"|"starts-soon"|"postponed"|"cancelled"|"ended"|"removed";
}

export interface IChannelMethods {
  ///setStatus(name:IChannelStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IChannel>;
}
export interface IChannel extends IChannelType,IChannelMethods,Document {}

export interface IViewerLogType {
  channel:IChannel;
  user?:ICustomer;
  session?: string;
  time: Date;
  meta:{
    visits:number;
    viewerCt: number;
    deviceInfo:any
    locationInfo:Partial<AddressObj>;
  }
}

export interface IViewerLogMethods {
  ///setStatus(name:IViewerLogStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IViewerLog>;
}
export interface IViewerLog extends IViewerLogType,IViewerLogMethods,Document {}