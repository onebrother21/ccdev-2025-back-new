import { body, param, query } from "express-validator";
import { CheckValidation } from "../../middlewares";

export class LivestreamOpsValidators {
  /** ------------------------ Customer Operations ------------------------ */

  static browseChannels = [[],CheckValidation] as IHandler[]; // No input needed
  static watchChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];
  static getChannelDetails = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static searchChannels = [[
    query("query").isString().notEmpty().withMessage("Search query is required"),
  ],CheckValidation] as IHandler[];

  static postComment = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("text").isString().notEmpty().withMessage("Comment text is required"),
  ],CheckValidation] as IHandler[];

  static deleteComment = [[
    param("commentId").isMongoId().withMessage("Invalid comment ID"),
  ],CheckValidation] as IHandler[];

  static reactToChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("type").isString().isIn(["like", "love", "haha", "wow", "sad", "angry"])
      .withMessage("Invalid reaction type"),
  ],CheckValidation] as IHandler[];

  static removeReaction = [[
    param("reactionId").isMongoId().withMessage("Invalid reaction ID"),
  ],CheckValidation] as IHandler[];

  static reportComment = [[
    param("commentId").isMongoId().withMessage("Invalid comment ID"),
    body("reason").isString().notEmpty().withMessage("Report reason is required"),
  ],CheckValidation] as IHandler[];

  static reportChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("reason").isString().notEmpty().withMessage("Report reason is required"),
  ],CheckValidation] as IHandler[];

  /** ------------------------ Artist Operations ------------------------ */

  static getArtistProfile = [[
    param("artistId").isMongoId().withMessage("Invalid artist ID"),
  ],CheckValidation] as IHandler[];

  static updateArtistProfile = [[
    param("artistId").isMongoId().withMessage("Invalid artist ID"),
    body("updates").isObject().withMessage("Updates must be an object"),
  ],CheckValidation] as IHandler[];

  static viewChannelEngagement = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static respondToComments = [[
    param("commentId").isMongoId().withMessage("Invalid comment ID"),
    body("responseText").isString().notEmpty().withMessage("Response text is required"),
  ],CheckValidation] as IHandler[];

  static requestChannelFeature = [[
    param("artistId").isMongoId().withMessage("Invalid artist ID"),
    body("channelRequest").isObject().withMessage("Request details must be provided"),
  ],CheckValidation] as IHandler[];

  /** ------------------------ Admin Operations ------------------------ */

  static createChannel = [[
    body("title").isString().notEmpty().withMessage("Channel title is required"),
    body("genre").isString().notEmpty().withMessage("Genre is required"),
    body("startTime").optional().isISO8601().withMessage("Invalid start time format"),
  ],CheckValidation] as IHandler[];

  static updateChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("updates").isObject().withMessage("Updates must be an object"),
  ],CheckValidation] as IHandler[];

  static deleteChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static endLiveStream = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static featureArtistsInChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("artistIds").isArray().withMessage("Artist IDs must be an array"),
    body("artistIds.*").isMongoId().withMessage("Invalid artist ID in array"),
  ],CheckValidation] as IHandler[];

  static viewReportedChannels = [[],CheckValidation] as IHandler[]; // No input needed

  static suspendChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static deleteCommentByAdmin = [[
    param("commentId").isMongoId().withMessage("Invalid comment ID"),
  ],CheckValidation] as IHandler[];

  static banUserFromChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("userId").isMongoId().withMessage("Invalid user ID"),
  ],CheckValidation] as IHandler[];

  static reviewReportedComments = [[],CheckValidation] as IHandler[]; // No input needed

  static getChannelPerformance = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static getArtistEngagementStats = [[
    param("artistId").isMongoId().withMessage("Invalid artist ID"),
  ],CheckValidation] as IHandler[];

  /** ------------------------ System-Level Operations ------------------------ */

  static scheduleChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("startTime").isISO8601().withMessage("Invalid date format for start time"),
  ],CheckValidation] as IHandler[];

  static autoArchiveChannel = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static pushLiveNotifications = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static trackViewerCount = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
  ],CheckValidation] as IHandler[];

  static logUserEngagement = [[
    param("channelId").isMongoId().withMessage("Invalid channel ID"),
    body("userId").isMongoId().withMessage("Invalid user ID"),
  ],CheckValidation] as IHandler[];

  static recommendChannels = [[
    param("userId").isMongoId().withMessage("Invalid user ID"),
  ],CheckValidation] as IHandler[];
};
export default LivestreamOpsValidators;