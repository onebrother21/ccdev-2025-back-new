
import { ProfilesService as Profiles } from "./profiles.service";
import { OrderService as Order } from "./order.service";
import { ProductsService as Product } from "../_v2/product-mgmt/product-mgmt.service";

import { NotificationService as Notification } from "./notification.service";
import { ReportsService as Reports } from "./reports.service";
import { GeoService as Geo } from "./geo.service";
import { MessageService as Message } from "./message.service";
import { WebSocketService as Sockets } from "./websocket.service";
import { AnalyticsService as Analytics } from "./analytics.service";

export const Services = {
  Order,
  Notification,
  Reports,
  Geo,
  Message,
  Sockets,
  Analytics,
};
export default Services;