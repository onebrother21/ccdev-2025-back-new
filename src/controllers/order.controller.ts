import { Order } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';

const CreateOrder:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const order = new Order({creator:req.user.id,...data});
  try {
    await(await order.save()).populate(`creator customer vendor courier`);
    res.locals = {
      status:201,
      success:true,
      data:order.json(),
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const GetOrder:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const order = await Order.findById(req.params.id);
  if (!order) res.status(404).json({success:false,message:"Order does not exist"});
  else {
    await order.populate(`creator customer courier vendor`);
    res.locals = {
      success:true,
      data:order.json(),
    };
    next();
  }
};
const UpdateOrder:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const $set = req.body.data;
  const orderId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!orderId) res.status(400).json({success: false,message: "No order identifier provided!"});
  try {
    const order = await Order.findByIdAndUpdate(orderId,{ $set },options);
    if(!order) res.status(404).json({
      success: false,
      message:"Order does not exist"
    });
    else {
      await order.runBusinessLogic(req.bvars);
      await order.populate(`creator customer courier vendor`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:order.json()
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const MarkOrderAsDeleted:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const orderId = req.params.id;
  const opts = {new:true,runValidators:true};
  if (!orderId) res.status(400).json({success: false,message: "No order identifier provided!"});
  try {
    const order = await Order.findOneAndUpdate({ _id:orderId },{$set:{status:{name:"deleted",time:new Date()}}},opts);
    if (!order) res.status(404).json({
      success: false,
      message:"Order does not exist"
    });
    else {
      await order.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:order.json()
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const DeleteOrder:IHandler = async (req,res,next) => {
  const orderId = req.params.id;
  if(!orderId) res.status(400).json({success: false,message: "No order identifier provided!"});
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if(!order) res.status(404).json({success: false,message:"Order does not exist"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:order?{deleted:orderId,ok:true}:null
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const QueryOrders:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
  const results = await Order
  .find(query,select,opts)
  //.populate( 'tags', null, { tagName: { $in: ['funny', 'politics'] } } )
  .exec();
  res.locals = {
    success:true,
    data:{results},
  };
  next();
};
const QueryOrdersByCustomerDetails:IHandler = async (req,res,next) => {
  try {
    const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
    const page = opts.currentPage || 1; // Default to page 1
    const limit = opts.limit || 10; // Default to 10 results per page
    const skip = (page - 1) * limit; // Calculate how many records to skip
    const sortField = opts.sort || 'createdOn';
    const sortOrder = opts.order === 'asc' ? 1 : -1;
    const results = await Order.aggregate([
      { $unwind: "$items" }, // Unwind items before filtering
      { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'customer' } },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      { $addFields: {
          "created_on": { "$toDouble": "$createdOn" },
          "delivered_on": { "$toDouble": "$deliveredOn" }
      }},
      { $match: query },
      { 
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          courier: { $first: "$courier" },
          vendor: { $first: "$vendor" },
          total: { $first: "$total" },
          status: { $first: "$status" },
          createdOn: { $first: "$createdOn" },
          items: { $push: "$items" } // Restore only the filtered items
        }
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { [sortField]: sortOrder } },  // Sorting stage
      { $lookup: { from: 'vendors', localField: 'vendor', foreignField: '_id', as: 'vendor' } },
      { $lookup: { from: 'couriers', localField: 'courier', foreignField: '_id', as: 'courier' } },
      { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$courier', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          _id: 0,
          total: 1,
          status: 1,
          createdOn: 1,
          items: { id: "$items.itemId", name: "$items.name" },
          customer: { id: "$customer._id", name: "$customer.name" },
          courier: { id: "$courier._id", name: "$courier.name" },
          vendor: { id: "$vendor._id", name: "$vendor.name" },
        }
      }
    ]);
    res.locals = {
      success:true,
      data:{results},
    };
    next();
  }
  catch (error) {
    res.status(500).json({successs:false,message:error.message});
  }
};
const QueryOrdersByCourierDetails:IHandler = async (req,res,next) => {
  try {
    const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
    const page = opts.currentPage || 1; // Default to page 1
    const limit = opts.limit || 10; // Default to 10 results per page
    const skip = (page - 1) * limit; // Calculate how many records to skip
    const sortField = opts.sort || 'createdOn';
    const sortOrder = opts.order === 'asc' ? 1 : -1;
    const results = await Order.aggregate([
      { $unwind: "$items" }, // Unwind items before filtering
      { $lookup: { from: 'couriers', localField: 'courier', foreignField: '_id', as: 'courier' } },
      { $unwind: { path: '$courier', preserveNullAndEmptyArrays: true } },
      { $addFields: {
          "created_on": { "$toDouble": "$createdOn" },
          "delivered_on": { "$toDouble": "$deliveredOn" }
      }},
      { $match: query },
      { 
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          courier: { $first: "$courier" },
          vendor: { $first: "$vendor" },
          total: { $first: "$total" },
          status: { $first: "$status" },
          createdOn: { $first: "$createdOn" },
          items: { $push: "$items" } // Restore only the filtered items
        }
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { [sortField]: sortOrder } },  // Sorting stage
      { $lookup: { from: 'vendors', localField: 'vendor', foreignField: '_id', as: 'vendor' } },
      { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'customer' } },
      { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          _id: 0,
          total: 1,
          status: 1,
          createdOn: 1,
          customer: { id: "$customer._id", name: "$customer.name" },
          courier: { id: "$courier._id", name: "$courier.name" },
          vendor: { id: "$vendor._id", name: "$vendor.name" },
          items: { id: "$items.itemId", name: "$items.name" },
        }
      }
    ]);
    res.locals = {
      success:true,
      data:{results},
    };
    next();
  }
  catch (error) {
    res.status(500).json({successs:false,message:error.message});
  }
};
const QueryOrdersByVendorDetails:IHandler = async (req,res,next) => {
  try {
    const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
    const page = opts.currentPage || 1; // Default to page 1
    const limit = opts.limit || 10; // Default to 10 results per page
    const skip = (page - 1) * limit; // Calculate how many records to skip
    const sortField = opts.sort || 'createdOn';
    const sortOrder = opts.order === 'asc' ? 1 : -1;
    const results = await Order.aggregate([
      { $unwind: "$items" }, // Unwind items before filtering
      { $lookup: { from: 'vendors', localField: 'vendor', foreignField: '_id', as: 'vendor' } },
      { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      { $addFields: {
          "created_on": { "$toDouble": "$createdOn" },
          "delivered_on": { "$toDouble": "$deliveredOn" }
      }},
      { $match: query },
      { 
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          courier: { $first: "$courier" },
          vendor: { $first: "$vendor" },
          total: { $first: "$total" },
          status: { $first: "$status" },
          createdOn: { $first: "$createdOn" },
          items: { $push: "$items" } // Restore only the filtered items
        }
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { [sortField]: sortOrder } },  // Sorting stage
      { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'customer' } },
      { $lookup: { from: 'couriers', localField: 'courier', foreignField: '_id', as: 'courier' } },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$courier', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          _id: 0,
          total: 1,
          status: 1,
          createdOn: 1,
          customer: { id: "$customer._id", name: "$customer.name" },
          courier: { id: "$courier._id", name: "$courier.name" },
          vendor: { id: "$vendor._id", name: "$vendor.name" },
          items: { id: "$items.itemId", name: "$items.name" },
        }
      }
    ]);
    res.locals = {
      success:true,
      data:{results},
    };
    next();
  }
  catch (error) {
    res.status(500).json({successs:false,message:error.message});
  }
};

export {
  CreateOrder,
  GetOrder,
  UpdateOrder,
  MarkOrderAsDeleted,
  DeleteOrder,
  QueryOrders,
  QueryOrdersByCustomerDetails,
  QueryOrdersByCourierDetails,
  QueryOrdersByVendorDetails
};