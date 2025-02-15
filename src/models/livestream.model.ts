import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const ArtistSchema = new Schema<Types.IArtist,Artist,Types.IArtistMethods>({
  name: { type: String, required: true },
  bio: { type: String },
  profileImage: { type: String },
  socialLinks: [{ platform: String, url: String }],
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
type Artist = Model<Types.IArtist,{},Types.IArtistMethods>;
const Artist:Artist = mongoose.model<Types.IArtist>('artists',ArtistSchema);


const CommentSchema = new Schema<Types.IComment,Comment,Types.ICommentMethods>({
  user: { type: ObjectId, ref: "users", required: true },
  channel: { type: ObjectId, ref: "channels", required: true },
  text: { type: String, required: true },
  reports:[Utils.reportItemSchema],
  replies:[ { type: ObjectId, ref: "users" }]
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
type Comment = Model<Types.IComment,{},Types.ICommentMethods>;
const Comment:Comment = mongoose.model<Types.IComment>('comments',CommentSchema);

const ReactionSchema = new Schema<Types.IReaction,Reaction,Types.IReactionMethods>({
  user: { type: ObjectId, ref: "users", required: true },
  channel: { type: ObjectId, ref: "channels", required: true },
  type: { type: String, enum: Object.values(Types.ReactionType), required: true },
  createdAt: { type: Date, default: Date.now },
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
type Reaction = Model<Types.IReaction,{},Types.IReactionMethods>;
const Reaction:Reaction = mongoose.model<Types.IReaction>('reactions',ReactionSchema);

const ChannelSchema = new Schema<Types.IChannel,Channel,Types.IChannelMethods>({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  genre: { type: String, required: true },
  featuredArtists: [{ type: Schema.Types.ObjectId, ref: "artists" }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isLive: { type: Boolean, default: false },
  viewerCt: { type: Number, default:0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  reactions: [{ type: Schema.Types.ObjectId, ref: "reactions" }],
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
type Channel = Model<Types.IChannel,{},Types.IChannelMethods>;
const Channel:Channel = mongoose.model<Types.IChannel>('channels',ChannelSchema);


const ViewerLogMetaSchema = new Schema<Types.IViewerLog["meta"]>({
  visits: { type: Number, default:1 },
  viewerCt: { type: Number, required: true },
  deviceInfo:{type:Object},
  locationInfo: {
    country: { type: String, default: "" },
    city: { type: String, default: "" },
  }
},{_id:false,timestamps:false});
const ViewerLogSchema = new Schema<Types.IViewerLog>({
  channel: { type: Schema.Types.ObjectId, ref: "channels", required: true },
  user: { type: Schema.Types.ObjectId, ref: "customers", default: null },
  session: { type: String, default: null }, // For tracking anonymous users
  time: { type: Date, default: Date.now },
  meta:ViewerLogMetaSchema,
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

type ViewerLog = Model<Types.IViewerLog,{},Types.IViewerLogMethods>;
const ViewerLog:ViewerLog = mongoose.model<Types.IViewerLog>('viewerLogs', ViewerLogSchema);

export { Artist, Comment, Reaction, Channel, ViewerLog };
