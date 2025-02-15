export const V2Routes = {
  Auth: {
    Signup: '/signup',
    Verify: '/verify',
    Register: '/register',
    Login: '/login',
    Logout: '/logout',
    Auto: '/auto',
    Refresh: '/refresh',
    Update: '/update',
    SwitchProfile: '/profile',
    AddCourierProfile: '/courier/add',
    AddVendorProfile: '/vendor/add',
    AddAdminProfile: '/admin/add',
    UpdateCustomerProfile: '/customer/update',
    UpdateCourierProfile: '/courier/update',
    UpdateVendorProfile: '/vendor/update',
    UpdateAdminProfile: '/admin/update',
  },
  VendorOps:{
    profile: {
      register: '/register',
      update: '/profile',
      get: '/profile',
      delete: '/profile',
      deleteX: '/delete'
    },
    products: {
      create: '/products',
      update: '/products/:productId',
      delete: '/products/:productId',
      list: '/products'
    },
    order: {
      list: '/orders',
      accept: '/order/:orderId/accept',
      reject: '/order/:orderId/reject',
      markReady: '/order/:orderId/ready',
      details: '/order/:orderId',
      updateStatus: '/order/:orderId/status'
    },
    courier: {
      assign: '/order/:orderId/assign-courier',
      track: 's',
      pending: '/orders/pending-couriers',
      cancel: '/order/:orderId/cancel-courier'
    },
    notifications: {
      orderUpdate: '/notify/order-update',
      broadcast: '/notify/broadcast',
      list: '/notifications'
    },
    analytics: {
      salesReport: '/analytics/sales',
      orderTrends: '/analytics/trends',
      customerInsights: '/analytics/customers'
    },
    settings: {
      businessHours: '/settings/business-hours',
      autoAccept: '/settings/auto-accept',
      courierPrefs: '/settings/preferences'
    }
  },
  CourierOps:{
    courier: {
      register: '/register',
      updateProfile: '/profile',
      getProfile: '/profile',
      deleteAccount: '/delete'
    },
    order: {
      list: '/orders',
      accept: '/order/:orderId/accept',
      reject: '/order/:orderId/reject',
      markAsPickedUp: '/order/:orderId/picked-up',
      markAsDelivered: '/order/:orderId/delivered',
      details: '/order/:orderId',
      updateStatus: '/order/:orderId/status'
    },
    navigation: {
      getRoute: '/order/:orderId/get-route',
      updateLoc: '/updateLoc',
      trackLoc: '/updateLoc',
    },
    notifications: {
      orderUpdate: '/notify/order-update',
      list: '/notifications'
    },
    analytics: {
      earningsReport: '/analytics/earnings',
      deliveryStats: '/analytics/stats',
      customerRatings: '/analytics/customers'
    },
    settings: {
      businessHours: '/settings/business-hours',
      autoAccept: '/settings/auto-accept',
      courierPrefs: '/settings/preferences'
    }
  },
  CustomerOps:{
    // 🔹 Account & Profile Management
    Register: "/customer/register",
    GetProfile: "/customer/profile/update",
    UpdateProfile: "/customer/profile/update",
    DeleteAccount: "/customer/profile/delete",
    DeleteXAccount: "/customer/profile/delete",
  
    // 🔹 Product Browsing & Shopping
    BrowseProducts: "/customer/products/browse",
    SearchProducts: "/customer/products/search",
    GetProductDetails: "/customer/product/:productId",
    AddToCart: "/customer/cart/add",
    UpdateCart: "/customer/cart/update",
    ClearCart: "/customer/cart/clear",
  
    // 🔹 Ordering & Fulfillment
    ViewOrders: "/customer/orders",
    PlaceOrder: "/customer/orders",
    GetOrderDetails: "/customer/order/:orderId",
    CancelOrder: "/customer/order/:orderId/cancel",
    TrackOrder: "/customer/order/:orderId/track",
    RateOrder: "/customer/order/:orderId/rate",
  
    // 🔹 Payments & Transactions
    AddPaymentMethod: "/customer/payment-method/add",
    GetTransactionHistory: "/customer/payment/history",
  
    // 🔹 Courier Tracking & Communication
    TrackCourierLocation: "/customer/courier/:courierId/track",
    ContactCourier: "/customer/courier/contact",
  
    // 🔹 Notifications & Support
    GetNotifications: "/customer/notification/:notificationId/read",
    MarkNotificationAsRead: "/customer/notification/:notificationId/read",
    SubmitFeedback: "/customer/feedback/submit",
  },
  AdminOps:{
    //🔹 Business Management
    business:{
      registerBusiness:"/business/register",
      verifyBusiness:"/business/verify",
      updateBusiness:"/business/:id",
      getBusiness:"/business/:id",
      deleteBusiness:"/business/:id",
    },
    //🔹 User & Vendor Management
    admin: {
      approveVendor:"/vendor/approve",
      suspendVendor:"/vendor/suspend",
      deleteVendor:"/vendor/delete",
      manageBusinessUsers:"/admins/manage",
      setUserPermissions:"/admins/update",
    },
    // 🔹 Financial Control
    financials:{
      reviewPayoutRequests:"/fin/payouts",
      getPayoutHistory:"/fin/payouts/history",
      processPayouts:"/fin/payouts/process",
      adjustVendorCommission:"/fin/vendors",
      generateRevenueReports:"/fin/revenue",
      trackBusinessExpenses:"/fin/expenses",
      updateBankDetails:"/acct/banking",
      setTaxInformation:"/acct/taxes",
    },
    // 🔹 Order & Fulfillment Oversight
    orders:{
      monitorOrderActivity:"/orders/view",
      resolveOrderDisputes:"/orders/disputes",
      enforceDeliverySLAs:"/orders/sla",
      viewBusinessOrders:"/orders/sla",
      updateOrderFulfillmentPolicy:"/orders/policies",
    },
    // 🔹 Analytics & Insights
    analytics:{
      analyzeSalesPerformance:"/analytics/sales",
      getCustomerTrends:"/analytics/customers",
      getCustomerBehaviorReports:"/analytics/behavior",
      monitorVendorPerformance:"/analytics/vendors",
      generateOperationalReports:"/analytics/ops",
    },
    // 🔹 System Settings & Policies
    system:{
      generateKeys:"/system/keys",
      updateBusinessVars:"/system/vars",
    },
    settings:{
      updatePlatformPolicies:"/settings/policies",
      configureBusinessSettings:"/settings/bvars",
      managePromotions:"/settings/promos",
      handleSecurityIncidents:"/settings/security",
    },
    // 🔹 Compliance & Support
    support:{
      auditVendorCompliance:"/support/vendor",
      reviewCustomerComplaints:"/support/customers",
      manageSupportTickets:"/support/msgs",
    },
    jobs:{
      create:"/jobs",
      logVars:"/jobs/bvars"
    },
    notifications: {
      orderUpdate: '/notify/order-update',
      list: '/notifications'
    },
  },
  LivestreamOps:{
    customer:{
      //🔹 Customer Operations: Watching & Interacting with Streams
      browseChannels:"/customer/browse",
      watchChannel:"/customer/browse",
      getChannelDetails:"/customer/browse",
      searchChannels:"/customer/browse",
      //🔹 Customer Operations: Engagement & Feedback
      postComment:"/customer/browse",
      deleteComment:"/customer/browse",
      reactToChannel:"/customer/browse",
      removeReaction:"/customer/browse",
      reportComment:"/customer/browse",
      reportChannel:"/customer/browse",
    },
    artist:{
      // 🔹 Artist Operations: Artist Profile & Content
      getArtistProfile:"/customer/browse",
      updateArtistProfile:"/customer/browse",
      viewChannelEngagement:"/customer/browse",
      respondToComments:"/customer/browse",
      requestChannelFeature:"/customer/browse",
    },
    admin:{
      // 🔹 Admin Operations: Channel & Content Management
      createChannel:"/customer/browse",
      updateChannel:"/customer/browse",
      deleteChannel:"/customer/browse",
      endLiveStream:"/customer/browse",
      featureArtistsInChannel:"/customer/browse",
      // 🔹 Admin Operations: Moderation & Policy Enforcement
      viewReportedChannels:"/customer/browse",
      suspendChannel:"/customer/browse",
      deleteCommentByAdmin:"/customer/browse",
      banUserFromChannel:"/customer/browse",
      reviewReportedComments:"/customer/browse",
      // 🔹 Admin Operations: Analytics & Insights
      getChannelPerformance:"/customer/browse",
      getArtistEngagementStats:"/customer/browse",
    },
    system:{
      // 🔹 Admin Operations: System-Level Operations
      scheduleChannel:"/customer/browse",
      autoArchiveChannel:"/customer/browse",
      pushLiveNotifications:"/customer/browse",
      trackViewerCount:"/customer/browse",
      logUserEngagement:"/customer/browse",
      recommendChannels:"/customer/browse",
    }
  },
  ProductMgmt: {
    CreateProduct: '/',
    QueryProducts: '/',
    QueryProductsByVendor: '/vendor',
    QueryProductsByDetails: '/details',
    GetProduct: '/:productId',
    UpdateProduct: '/:productId',
    DeleteProduct: '/:productId',
  },
  Orders: {
    Create: '/orders',
    Update: '/orders/:orderId',
    Cancel: '/orders/:orderId/cancel',
    Fulfill: '/orders/:orderId/fulfill',
    GetByUser: '/orders/user',
    GetByVendor: '/orders/vendor',
  },
  CourierAssignment: {
    FindAvailable: 's/available',
    AssignCourier: 's/assign',
    AcceptOrder: 's/:orderId/accept',
    RejectOrder: 's/:orderId/reject',
    FulfillOrder: 's/:orderId/fulfill',
  },
};