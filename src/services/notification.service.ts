import { Schema } from "mongoose";
import Models from "../models";
import Types from "../types";
import Utils from '../utils';

type ObjectId = Schema.Types.ObjectId;

export class NotificationService {
  static createNotification = async (
    type:keyof typeof Types.INotificationTemplates,
    method:Types.INotificationSendMethods,
    audience:(Types.IUser|ObjectId|string)[],
    data?:any
  ) => {
    if (!audience.length) return; // Prevent errors if user ID is missing
    return await Models.Notification.create({type,method,audience,data});
  };
  static getNotifications = async (userId:string) => {
    return await Models.Notification.find({audience:userId});
  };
}