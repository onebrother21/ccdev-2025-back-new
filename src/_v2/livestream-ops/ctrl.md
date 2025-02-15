
  /** ------------------------ Artist Operations ------------------------ */
  static getArtistProfile:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.getArtistProfile(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static updateArtistProfile:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.updateArtistProfile(role,user_);
      res.locals.success = true,
      res.locals.message = req.t(Utils.transStrings.registeredsuccessfully, {name: user.name.first}),
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static viewChannelEngagement:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.viewChannelEngagement(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static respondToComments:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.respondToComments(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static requestChannelFeature:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.requestChannelFeature(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  /** ------------------------ Admin Operations ------------------------ */
  static createChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.createChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static updateChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.updateChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static deleteChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.deleteChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static endLiveStream:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.endLiveStream(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static featureArtistsInChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.featureArtistsInChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static viewReportedChannels:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.viewReportedChannels(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static suspendChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.suspendChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static deleteCommentByAdmin:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.deleteCommentByAdmin(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static banUserFromChannel:IHandler = async (channelId: string, userId: string) => {
    return await Models.Channel.findByIdAndUpdate(channelId, { $push: { bannedUsers: userId } });
  }
  static reviewReportedComments:IHandler  = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.reviewReportedComments(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static getChannelPerformance:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.getChannelPerformance(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static getArtistEngagementStats:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.getArtistEngagementStats(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  /** ------------------------ System-Level Operations ------------------------ */
  static scheduleChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.scheduleChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static autoArchiveChannel:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.autoArchiveChannel(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static pushLiveNotifications:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.pushLiveNotifications(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static trackViewerCount:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.trackViewerCount(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static logUserEngagement:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.logUserEngagement(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };
  static recommendChannels:IHandler = async (req,res,next) => {
    const user_ = req.user as Types.IUser;
    const role = user_.role as Types.IProfileTypes;
    try {
      const {user} = await LivestreamOpsService.recommendChannels(role,user_);
      res.locals.success = true,
      res.locals.data = user.json(role,true);
      next();
    } catch(e){ next(e); }
  };

  
// 🔹 Artist Operations: Artist Profile & Content
router.post(routes.artist.getArtistProfile,[...validators.getArtistProfile,ctrl.getArtistProfile,...PostMiddleware]);
router.post(routes.artist.updateArtistProfile,[...validators.updateArtistProfile,ctrl.updateArtistProfile,...PostMiddleware]);
router.post(routes.artist.viewChannelEngagement,[...validators.viewChannelEngagement,ctrl.viewChannelEngagement,...PostMiddleware]);
router.post(routes.artist.respondToComments,[...validators.respondToComments,ctrl.respondToComments,...PostMiddleware]);
router.post(routes.artist.requestChannelFeature,[...validators.requestChannelFeature,ctrl.requestChannelFeature,...PostMiddleware]);
// 🔹 Admin Operations: Channel & Content Management
router.post(routes.admin.createChannel,[...validators.createChannel,ctrl.createChannel,...PostMiddleware]);
router.post(routes.admin.updateChannel,[...validators.updateChannel,ctrl.updateChannel,...PostMiddleware]);
router.post(routes.admin.deleteChannel,[...validators.deleteChannel,ctrl.deleteChannel,...PostMiddleware]);
router.post(routes.admin.endLiveStream,[...validators.endLiveStream,ctrl.endLiveStream,...PostMiddleware]);
router.post(routes.admin.featureArtistsInChannel,[...validators.featureArtistsInChannel,ctrl.featureArtistsInChannel,...PostMiddleware]);
// 🔹 Admin Operations: Moderation & Policy Enforcement
router.post(routes.admin.viewReportedChannels,[...validators.viewReportedChannels,ctrl.viewReportedChannels,...PostMiddleware]);
router.post(routes.admin.suspendChannel,[...validators.suspendChannel,ctrl.suspendChannel,...PostMiddleware]);
router.post(routes.admin.deleteCommentByAdmin,[...validators.deleteCommentByAdmin,ctrl.deleteCommentByAdmin,...PostMiddleware]);
router.post(routes.admin.banUserFromChannel,[...validators.banUserFromChannel,ctrl.banUserFromChannel,...PostMiddleware]);
router.post(routes.admin.reviewReportedComments,[...validators.reviewReportedComments,ctrl.reviewReportedComments,...PostMiddleware]);
// 🔹 Admin Operations: Analytics & Insights
router.post(routes.admin.getChannelPerformance,[...validators.getChannelPerformance,ctrl.getChannelPerformance,...PostMiddleware]);
router.post(routes.admin.getArtistEngagementStats,[...validators.getArtistEngagementStats,ctrl.viewChannelEngagement,...PostMiddleware]);
// 🔹 Admin Operations: System-Level Operations
router.post(routes.system.scheduleChannel,[...validators.scheduleChannel,ctrl.scheduleChannel,...PostMiddleware]);
router.post(routes.system.autoArchiveChannel,[...validators.autoArchiveChannel,ctrl.autoArchiveChannel,...PostMiddleware]);
router.post(routes.system.pushLiveNotifications,[...validators.pushLiveNotifications,ctrl.pushLiveNotifications,...PostMiddleware]);
router.post(routes.system.trackViewerCount,[...validators.trackViewerCount,ctrl.trackViewerCount,...PostMiddleware]);
router.post(routes.system.logUserEngagement,[...validators.logUserEngagement,ctrl.logUserEngagement,...PostMiddleware]);
router.post(routes.system.recommendChannels,[...validators.recommendChannels,ctrl.recommendChannels,...PostMiddleware]);