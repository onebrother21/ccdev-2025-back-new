export const Routes = {
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
  AdminOps:{
    admin: {
      register: '/register',
      updateProfile: '/profile',
      getProfile: '/profile',
      deleteAccount: '/delete',
    },
    jobs:{
      create:"/jobs/create"
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
  Products: {
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
  VendorOps:{
    profile: {
      register: '/register',
      update: '/profile',
      get: '/profile',
      delete: '/profile',
      deleteX: '/delete'
    },
    product: {
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
  }
};