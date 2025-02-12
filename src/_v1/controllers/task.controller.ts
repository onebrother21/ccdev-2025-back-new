import { Task,Notification } from '../../models';
import { CommonUtils,logger,transStrings } from '../../utils';
import * as AllTypes from "../../types";

const CreateTask:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const task = new Task({creator:req.user.id,...data});
  try {
    await task.save();
    await task.populate(`creator notes.user tasks`);
    res.locals = {
      status:201,
      success:true,
      data:task.json(),
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
const GetTask:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const task = await Task.findById(req.params.id);
  if (!task) res.status(404).json({success:false,message:"Task does not exist"});
  else {
    await task.populate(`creator notes.user tasks`);
    res.locals = {
      success:true,
      data:task.json(),
    };
    next();
  }
};
const UpdateTask:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const $set = req.body.data;
  const taskId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!taskId) res.status(400).json({success: false,message: "No task identifier provided!"});
  try {
    const task = await Task.findByIdAndUpdate(taskId,{ $set },options);
    if (!task) res.status(404).json({
      success: false,
      message:"Task does not exist"
    });
    else {
      await task.populate(`creator notes.user tasks`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
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
const AddNote:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const note = req.body.data;
  const taskId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!taskId) res.status(400).json({success: false,message: "No task identifier provided!"});
  try{
    const task = await Task.findByIdAndUpdate(taskId,{$push:{notes:{$each:[note]}}},options);
    if(!task) res.status(404).json({success:false,message:"Task does not exist"});
    else {
      await task.populate(`creator notes.user tasks`);
      res.locals = {
        status:201,
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
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
const UpdateNote:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const taskId = req.params.id;
  const name = req.params.slug;
  const options = {new:true,runValidators:true};
  const updates = {};
  if(!taskId) res.status(400).json({success: false,message: "Invalid taskId"});
  try {
    for(const k in req.body.data) updates['notes.$.'+k] = req.body.data[k];
    const task = await Task.findOneAndUpdate({_id:taskId,notes:{$elemMatch:{name}}},{$set:updates},options);
    if(!task) res.status(404).json({success:false,message:"Task does not exist"});
    else {
      await task.populate(`creator notes.user tasks`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const AddSubTask:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const taskId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!taskId) res.status(400).json({success: false,message: "No task identifier provided!"});
  try{
    const subtask = new Task({creator:req.user.id,...data});
    await subtask.save();
    const task = await Task.findByIdAndUpdate(taskId,{$push:{tasks:{$each:[subtask._id]}}},options);
    if(!task) res.status(404).json({success:false,message:"Task does not exist"});
    else {
      await task.populate(`creator notes.user tasks`);
      res.locals = {
        status:201,
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
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
const UpdateSubTask:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const taskId = req.params.id;
  const subtaskId = req.params.subtaskId;
  const options = {new:true,runValidators:true};
  const updates = req.body.data;
  console.log({taskId,subtaskId})
  if(!taskId) res.status(400).json({success: false,message: "Invalid taskId"});
  try {
    const subtask = await Task.findByIdAndUpdate(subtaskId,updates,options);
    const task = await Task.findById(taskId);
    if(!(task && subtask)) res.status(404).json({success:false,message:"Task does not exist"});
    else {
      await task.populate(`creator notes.user tasks`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const MarkTaskAsDeleted:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const taskId = req.params.id;
  const opts = {new:true,runValidators:true};
  if (!taskId) res.status(400).json({success: false,message: "No task identifier provided!"});
  try {
    const task = await Task.findOneAndUpdate({ _id:taskId },{$set:{status:{name:"deleted",time:new Date()}}},opts);
    if (!task) res.status(404).json({
      success: false,
      message:"Task does not exist"
    });
    else {
      await task.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task.json()
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
const DeleteTask:IHandler = async (req,res,next) => {
  const taskId = req.params.id;
  if(!taskId) res.status(400).json({success: false,message: "No task identifier provided!"});
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if(!task) res.status(404).json({success: false,message:"Task does not exist"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:task?{deleted:taskId,ok:true}:null
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
const QueryTasks:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
  const results = await Task
  .find(query,select,opts)
  //.populate( 'tags', null, { tagName: { $in: ['funny', 'politics'] } } )
  .exec();
  res.locals = {
    success:true,
    data:{results},
  };
  next();
};
const QueryTasksByDetails:IHandler = async (req,res,next) => {
  try {
    const {q:query,s:select,o:opts,t:timestamp} = JSON.parse(req.query.q as string);
    const page = opts.currentPage || 1; // Default to page 1
    const limit = opts.limit || 10; // Default to 10 results per page
    const skip = (page - 1) * limit; // Calculate how many records to skip
    const sortField = opts.sort || 'createdOn';
    const sortTask = opts.order === 'asc' ? 1 : -1;
    const results = await Task.aggregate([
      //{ $unwind: "$items" }, // Unwind items before filtering
      { $lookup: { from: 'users', localField: 'creator', foreignField: '_id', as: 'creator' } },
      { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
      { $addFields: {
          "created_on": { "$toDouble": "$createdOn" },
          "due_on": { "$toDouble": "$dueOn" }
      }},
      { $match: query },
      { 
        $group: {
          _id: "$_id",
          creator: { $first: "$creator" },
          //courier: { $first: "$courier" },
          //vendor: { $first: "$vendor" },
          //total: { $first: "$total" },
          status: { $first: "$status" },
          createdOn: { $first: "$createdOn" },
          dueOn: { $first: "$dueOn" },
          //items: { $push: "$items" } // Restore only the filtered items
        }
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { [sortField]: sortTask } },  // Sorting stage
      //{ $lookup: { from: 'vendors', localField: 'vendor', foreignField: '_id', as: 'vendor' } },
      //{ $lookup: { from: 'couriers', localField: 'courier', foreignField: '_id', as: 'courier' } },
      //{ $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      //{ $unwind: { path: '$courier', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$_id",
          _id: 0,
          total: 1,
          status: 1,
          createdOn: 1,
          dueOn: 1,
          creator: { id: "$creator._id", name: "$creator.name" },
          //courier: { id: "$courier._id", name: "$courier.name" },
          //vendor: { id: "$vendor._id", name: "$vendor.name" },
          //items: { id: "$items.itemId", name: "$items.name" },
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
  CreateTask,
  GetTask,
  UpdateTask,
  MarkTaskAsDeleted,
  DeleteTask,
  AddNote,
  UpdateNote,
  AddSubTask,
  UpdateSubTask,
  QueryTasks,
  QueryTasksByDetails,
};