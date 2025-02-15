import Models from '../../models';
import Services from '../../services';
import Types from "../../types";
import Utils from '../../utils';

export class LivestreamOpsService {
  
  /** ------------------------ Customer Operations ------------------------ */

  static async searchChannels(query: string) {
    return await Models.Channel.find({ title: new RegExp(query, "i") });
  }
  static async browseChannels() {
    return await Models.Channel.find({status:"is-live"}).select("title genre artists startTime");
  }
  static async watchChannel(channelId: string,customerId:string,) {
    const channel = await Models.Channel.findById(channelId);
    if (!channel) throw new Utils.AppError(404, "Channel not found.");
    channel.viewerCt += 1;
    await channel.save();
    await Services.Analytics.logUserEngagement(customerId,channelId,"watch-livestream",{viewerCt:channel.viewerCt});
    return channel.json();
  }
  static async getChannelDetails(channelId: string) {
    const channel = await Models.Channel.findById(channelId).populate("artists comments.reactions");
    if (!channel) throw new Utils.AppError(404, "Channel not found!");
    return channel.json();
  }
  static async postComment(channelId: string, customerId: string, text: string) {
    const channel = await Models.Channel.findById(channelId);
    if (!channel) throw new Utils.AppError(404, "Channel not found!");
    const comment = await Models.Comment.create({ channel: channelId, user: customerId, text });
    Services.Sockets.broadcastToChannel(channelId, "new-comment", comment);
    return comment;
  }
  static async deleteComment(commentId: string, customerId: string) {
    const comment = await Models.Comment.findOneAndDelete({ _id: commentId, user: customerId });
    if (!comment) throw new Utils.AppError(403, "Not authorized to delete this comment");
    return { ok: true };
  }
  static async reactToChannel(channelId: string, customerId: string, type: string) {
    const channel = await Models.Channel.findById(channelId);
    if (!channel) throw new Utils.AppError(404, "Channel not found!");
    const reaction = await Models.Reaction.create({ channel: channelId, user: customerId, type });
    Services.Sockets.broadcastToChannel(channelId, "new-reaction", reaction);
    return reaction;
  }
  static async removeReaction(reactionId: string, customerId: string) {
    const reaction = await Models.Reaction.findByIdAndDelete(reactionId,{user:customerId});
    if (!reaction) throw new Utils.AppError(403, "Not authorized to remove this reaction");
    return { ok: true };
  }
  static async reportComment(commentId: string,profileId: string,profileRef:string,reason: string) {
    await Models.Comment.findByIdAndUpdate(commentId,{$push:{reports:[
      {
        reason,
        time:new Date(),
        user:profileId,
        userRef:profileRef,
        content:commentId,
        contentRef:"comments",
      } 
    ]}});
    return { ok: true };
  }
  static async reportChannel(channelId: string,profileId: string,profileRef:string,reason: string) {
    await Models.Channel.findByIdAndUpdate(channelId,{$push:{reports:[
      {
        reason,
        time:new Date(),
        user:profileId,
        userRef:profileRef,
        content:channelId,
        contentRef:"channels",
      } 
    ]}});
    return { ok: true };
  }

  /** ------------------------ Artist Operations ------------------------ */

  static async getArtistProfile(artistId: string) {
    return await Models.Artist.findById(artistId);
  }

  static async updateArtistProfile(artistId: string, updates: Partial<any>) {
    return await Models.Artist.findByIdAndUpdate(artistId, updates, { new: true });
  }

  static async viewChannelEngagement(channelId: string) {
    const reactions = await Models.Reaction.countDocuments({ channel: channelId });
    const comments = await Models.Comment.countDocuments({ channel: channelId });
    return { reactions, comments };
  }

  static async respondToComments(commentId: string, artistId: string, responseText: string) {
    const comment = await Models.Comment.findById(commentId);
    if (!comment) throw new Utils.AppError(404, "Comment not found!");
    const reply = new Models.Comment({user:artistId as any, text:responseText,channel:comment.channel});
    comment.replies.push(reply);
    await comment.save();
    return comment;
  }

  static async requestChannelFeature(artistId: string, channelRequest: any) {
    //await NotificationService.notifyAdmins("New artist feature request", artistId);
    return { ok: true };
  }

  /** ------------------------ Admin Operations ------------------------ */

  static async createChannel(data:any) {
    return await Models.Channel.create(data);
  }

  static async updateChannel(channelId: string, updates: Partial<Types.IChannel>) {
    return await Models.Channel.findByIdAndUpdate(channelId, updates, { new: true });
  }

  static async deleteChannel(channelId: string) {
    return await Models.Channel.findByIdAndDelete(channelId);
  }

  static async endLiveStream(channelId: string) {
    return await Models.Channel.findByIdAndUpdate(channelId, { isLive: false }, { new: true });
  }

  static async featureArtistsInChannel(channelId: string, artistIds: string[]) {
    return await Models.Channel.findByIdAndUpdate(channelId, { $push: { artists: { $each: artistIds } } }, { new: true });
  }

  static async viewReportedChannels() {
    return await Models.Channel.find({ reported: true });
  }

  static async suspendChannel(channelId: string) {
    return await Models.Channel.findByIdAndUpdate(channelId, { suspended: true });
  }

  static async deleteCommentByAdmin(commentId: string) {
    return await Models.Comment.findByIdAndDelete(commentId);
  }

  static async banUserFromChannel(channelId: string, customerId: string) {
    return await Models.Channel.findByIdAndUpdate(channelId, { $push: { bannedUsers: customerId } });
  }

  static async reviewReportedComments() {
    return await Models.Comment.find({ reported: true });
  }

  static async getChannelPerformance(channelId: string) {
    return await Services.Analytics.getViewershipStats(channelId);
  }

  static async getArtistEngagementStats(artistId: string) {
    return await Services.Analytics.getArtistPerformance(artistId);
  }

  /** ------------------------ System-Level Operations ------------------------ */

  static async scheduleChannel(channelId: string, startTime: Date) {
    return await Models.Channel.findByIdAndUpdate(channelId, { scheduledTime: startTime });
  }

  static async autoArchiveChannel(channelId: string) {
    return await Models.Channel.findByIdAndUpdate(channelId, { archived: true });
  }

  static async pushLiveNotifications(channelId: string) {
    const channel = await Models.Channel.findById(channelId);
    if (!channel) throw new Utils.AppError(404, "Channel not found!");
    //await NotificationService.notifyUsers(`Live Now: ${channel.title}`, channelId);
  }

  static async trackViewerCount(channelId: string) {
    return await Models.Channel.findById(channelId).select("viewerCt");
  }

  static async logUserEngagement(channelId: string, customerId: string,type:string,data:any) {
    return await Services.Analytics.logUserEngagement(channelId,customerId,type,data);
  }

  static async recommendChannels(customerId: string) {
    return await Services.Analytics.recommendChannels(customerId);
  }
}