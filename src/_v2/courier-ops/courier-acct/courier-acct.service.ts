import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierAcctMgmtService {
  /** 📌 Courier Management */
  /** 📌 Creates courier profile */
  static registerCourier = async (user:Types.IUser,data:any) => {
    const role = Types.IProfileTypes.VENDOR;
    const courier = new Models.Courier({
      ...data,
      mgr:user._id,
      users:[user._id],
      name:user.name.first + " " + user.name.last,
      displayName:user.username,
      location:{type:"Point",coordinates:data.location}
    });
    await courier.setStatus(Types.IProfileStatuses.NEW,null,true);
    user.profiles[role] = courier.id;
    await user.save();
    //send ACCOUNT_UPDATE
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {accountNo:courier.id};
    await Services.Notification.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return { ok:true };
  };
  /** 📌 Updates courier profile */
  static updateCourierProfile = async (courierId: string, data: any) => {
    const courier = await Models.Courier.findByIdAndUpdate(courierId, data, { new: true });
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    return { courier };
  };
  /** 📌 Fetches and popluates courier profile */
  static getCourierProfile = async (courierId: string) => {return await Models.Courier.findById(courierId);};
  /** 📌 Mark a courier profile for deletion */
  static deleteCourierProfile = async (courierId: string) => {
    const courier = await Models.Courier.findById(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    await courier.setStatus(Types.IProfileStatuses.DELETED,null,true);
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Mark a courier profile for deletion */
  static deleteXCourierProfile = async (courierId: string) => {
    const courier = await Models.Courier.findByIdAndDelete(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Updates a courier avaiability */
  static setCourierAvailability = async (courierId: string) => {
    const courier = await Models.Courier.findById(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    await courier.setStatus(Types.IProfileStatuses.ACTIVE,null,true);
    return { message: "Courier set to avaiable." };
  };
}