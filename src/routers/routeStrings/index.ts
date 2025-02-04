export const Routes = {
  /* AUTH */
  auth:"/auth",
  register:"/register",
  login:"/login",
  verifyEmail:"/verify",
  autologin: "/auto",
  update: "/update",

  jobs:"/jobs",
  adminOps:"/adminOps",

  /* PROFILES */
  admin:"/admin",
  admins:"/admins",
  adminId:"/admins/:id",
  couriers:"/couriers",
  courierId:"/couriers/:id",
  customers:"/customers",
  customerId:"/customers/:id",
  vendors:"/vendors",
  vendorId:"/vendors/:id",

  /* BUSINESS OBJECTS */
  products:"/products",
  productId:"/products/:id",

  orders:"/orders",
  orderId:"/orders/:id",

  tasks:"/tasks",
  taskId:"/tasks/:id",

  notifications:"/notifications",

  chats:"./chats",
  chatId:"./chats/:id",
  chatMessageId:"./chats/:id/msgs/:msgId",

  pokerPlans:"/pokerPlans",
  pokerPlanId:"/pokerPlans/:id",
  addVenuesToPokerPlan:"/pokerPlans/:id/venues",
  updatePokerVenue:"/pokerPlans/:id/venues/:venueName",
  removeVenueFromPokerPlan:"/pokerPlans/:id/venues/:venueName",
  addEntriesToPokerPlan:"/pokerPlans/:id/entries",
  updatePokerEntry:"/pokerPlans/:id/entries/:entryId",
  removeEntryFromPokerPlan:"/pokerPlans/:id/entries/:entryId",
};