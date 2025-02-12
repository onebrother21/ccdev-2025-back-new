import { Schema } from "mongoose";
import { Notification } from "../models";
import * as AllTypes from "../types";

type ObjectId = Schema.Types.ObjectId;

export class NotificationService {
  static createNotification = async (
    type:keyof typeof AllTypes.INotificationTemplates,
    method:AllTypes.INotificationSendMethods,
    audience:(AllTypes.IUser|ObjectId|string)[],
    data?:any
  ) => {
    if (!audience.length) return; // Prevent errors if user ID is missing
    return await Notification.create({type,method,audience,data});
  };
  static getNotifications = async (userId:string) => {
    return await Notification.find({audience:userId});
  };
}