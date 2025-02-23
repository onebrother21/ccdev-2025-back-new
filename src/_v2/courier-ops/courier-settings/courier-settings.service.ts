import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierSettingsService {
  // Courier settings
  /** 📌 Updates courier business hours */
  static updateBusinessHours = async (courierId: string, hours: { open: string, close: string }) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { businessHours: hours }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Business hours updated successfully." };
  }
  /** 📌 Enables or disables automatic order acceptance */
  static setAutoAcceptOrders = async (courierId: string, autoAccept: boolean) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { autoAcceptOrders: autoAccept }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: `Auto-accept orders ${autoAccept ? "enabled" : "disabled"}.` };
  }
  /** 📌 Defines preferred customers or delivery conditions */
  static setCourierPreferences = async (courierId: string, preferences: any) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { courierPreferences: preferences }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Courier preferences updated successfully." };
  }
}