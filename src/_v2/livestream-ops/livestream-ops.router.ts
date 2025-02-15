import { Router } from 'express';
import { LivestreamOpsController as ctrl } from './livestream-ops.controller';
import { LivestreamOpsValidators as validators } from './livestream-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import Utils from '../../utils';

const LivestreamOpsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.LivestreamOps
  const router = Router();
  
  router.use(AuthJWT);
  //🔹 Customer Operations: Watching & Interacting with Streams
  router.post(routes.customer.browseChannels,[...validators.browseChannels,ctrl.browseChannels,...PostMiddleware]);
  router.post(routes.customer.watchChannel,[...validators.watchChannel,ctrl.watchChannel,...PostMiddleware]);
  router.post(routes.customer.getChannelDetails,[...validators.getChannelDetails,ctrl.getChannelDetails,...PostMiddleware]);
  router.post(routes.customer.searchChannels,[...validators.searchChannels,ctrl.searchChannels,...PostMiddleware]);
  //🔹 Customer Operations: Engagement & Feedback
  router.post(routes.customer.postComment,[...validators.postComment,ctrl.postComment,...PostMiddleware]);
  router.post(routes.customer.deleteComment,[...validators.deleteChannel,ctrl.deleteComment,...PostMiddleware]);
  router.post(routes.customer.reactToChannel,[...validators.reactToChannel,ctrl.reactToChannel,...PostMiddleware]);
  router.post(routes.customer.removeReaction,[...validators.removeReaction,ctrl.removeReaction,...PostMiddleware]);
  router.post(routes.customer.reportComment,[...validators.reportComment,ctrl.reportComment,...PostMiddleware]);
  router.post(routes.customer.reportChannel,[...validators.reportChannel,ctrl.reportChannel,...PostMiddleware]);

  return router;
};
export { LivestreamOpsRouter };
export default LivestreamOpsRouter;