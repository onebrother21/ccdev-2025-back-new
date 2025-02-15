Customer Operations
These are actions that regular users (customers) can take while watching live streams.


Livestream Watching & Interacting with Streams
browseChannels: View a list of available live and past streams.
watchChannel: Start watching a live stream or a recorded past stream.
getChannelDetails: Retrieve metadata of a channel (title, artists, genre, etc.).
searchChannels: Search for live or past streams based on keywords, genres, or artists.

Livestream Engagement & Feedback
postComment: Add a comment to a live stream.
deleteComment: Remove their own comment from a channel.
reactToChannel: Add a reaction (like, love, fire, etc.) to a stream.
removeReaction: Remove their reaction from a stream.
reportComment: Report a comment for inappropriate content.
reportChannel: Report a channel for violations.

Artist Operations
These are actions that artists can perform related to live streams where they are featured.

Artist Profile & Content
getArtistProfile: Retrieve details about an artist.
updateArtistProfile: Modify artist details (bio, social links, profile image, etc.). Live Performance & Engagement
viewChannelEngagement: See live reactions and comments on a channel they are featured in.
respondToComments: Reply to comments on their live stream.
requestChannelFeature: Request to be featured in a new live stream.

Admin Operations
Admins manage the streaming system, ensuring content moderation and operational integrity.

Channel & Content Management
createChannel: Set up a new live stream.
updateChannel: Modify stream details before or during the event.
deleteChannel: Remove a channel from the system.
endLiveStream: Mark a live stream as ended.
featureArtistsInChannel: Assign artists to a channel.

Moderation & Policy Enforcement
viewReportedChannels: See reported channels and take action.
suspendChannel: Temporarily disable a channel due to policy violations.
deleteCommentByAdmin: Remove a comment violating policies.
banUserFromChannel: Restrict a user from commenting on a specific channel.
reviewReportedComments: Moderate comments flagged as inappropriate.

Analytics & Insights
getChannelPerformance: Retrieve viewership, engagement stats, and reaction analytics.
getArtistEngagementStats: See which artists are driving the most engagement.

System-Level Operations
These operations may be performed by background jobs, workers, or automated services.

scheduleChannel: Automatically start and stop streams at scheduled times.
autoArchiveChannel: Move completed live streams to recorded storage.
pushLiveNotifications: Notify users when a followed artist or favorite genre goes live.
trackViewerCount: Monitor real-time viewer count on streams.
logUserEngagement: Track comments and reactions for analytics.
recommendChannels: Suggest channels to users based on viewing history.

Next Steps
Now that we have a structured list of operations, do you want to:

Start implementing APIs (Service, Controller, Routes, Validators)?
Add WebSocket support for real-time engagement (comments, reactions, viewer count updates)?
Define worker jobs for automated processes (scheduling, notifications, archiving)?