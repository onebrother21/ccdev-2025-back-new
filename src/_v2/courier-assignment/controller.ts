
import Utils from '../../utils';
import { CourierMgmtService } from "./service";

export class CourierAssignmentController {
  static FindAvailableCouriers:IHandler = async (req,res,next) => {
    try {
      const {availableCouriers:couriers} = await CourierMgmtService.findAvaliable(req.query as any);
      res.locals = {succes:true,data:{couriers}};
    } catch(e){ next(e); }
  };
  static AssignCourier:IHandler = async (req,res,next) => {
    try {
      const { ok } = await CourierMgmtService.assignCourier(req.body);
      res.locals = { success:true,message: 'Courier assigned successfully' };
    } catch (error) { next(error); }
  };
  static AcceptOrder:IHandler = async (req,res,next) => {
    try {
      const { orderId } = req.params;
      const { courierId } = req.body;
      const {order} = await CourierMgmtService.acceptOrder({orderId,courierId});
      res.locals = {success:true,message: 'Order accepted' };
    } catch (error) {next(error); }
  };
  static RejectOrder:IHandler = async (req,res,next) => {
    try {
      const { orderId } = req.params;
      const { courierId,reason } = req.body;
      const {order} = await CourierMgmtService.rejectOrder({orderId,courierId,reason});
      res.locals = {success:true, message: 'Order rejected, reassigning...'};
    } catch (error) {next(error); }
  };
  static FulfillOrder:IHandler = async (req,res,next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const {order} = await CourierMgmtService.fulfillOrder({orderId,status});
      res.locals = {success:true,message:`Order ${status}`};
    } catch (error) { next(error); }
  };
  //post location
};
export default CourierAssignmentController;