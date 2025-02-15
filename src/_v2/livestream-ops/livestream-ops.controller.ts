import { LivestreamOpsService } from './livestream-ops.service';
import Models from "../../models";
import Types from "../../types";
import Utils from '../../utils';
import Services from "../../services";

export class LivestreamOpsController {
  /** ------------------------ Customer Operations ------------------------ */

  static browseChannels:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data =  await LivestreamOpsService.browseChannels();
      next();
    } catch(e){ next(e); }
  };
  static watchChannel:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.watchChannel(req.profile.id,req.params.channelId);
      next();
    } catch(e){ next(e); }
  };
  static getChannelDetails:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.getChannelDetails(req.params.channelId);
      next();
    } catch(e){ next(e); }
  };
  static searchChannels:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.searchChannels(req.query.q as string);
      next();
    } catch(e){ next(e); }
  };
  static postComment:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.postComment(req.params.channelId,req.profile.id,req.body.data.msg);
      next();
    } catch(e){ next(e); }
  };
  static deleteComment:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.deleteComment(req.params.commentId,req.profile.id);
      next();
    } catch(e){ next(e); }
  };
  static reactToChannel:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.reactToChannel(req.params.channelId,req.profile.id,req.body.data.type);
      next();
    } catch(e){ next(e); }
  };
  static removeReaction:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.removeReaction(req.params.reactionId,req.profile.id);
      next();
    } catch(e){ next(e); }
  };
  static reportComment:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.reportComment(
        req.params.commentId,
        req.profile.id,
        req.user.role,
        req.body.data.reason
      );
      next();
    } catch(e){ next(e); }
  };
  static reportChannel:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true,
      res.locals.data = await LivestreamOpsService.reportChannel(
        req.params.channelId,
        req.profile.id,
        req.user.role,
        req.body.data.reason
      );
      next();
    } catch(e){ next(e); }
  };
}