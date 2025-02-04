import { PokerPlan } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';

const CreatePokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const plan = new PokerPlan({
    creator:req.user.id,
    ...data,
    venues:[],
    entries:[],
  });
  try {
    await(await plan.save()).populate(`creator`);
    res.locals = {
      status:201,
      success:true,
      data: plan.json(),
    };
    next();
  }
  catch(e){
    res.status(400).send({
      success: false,
      message: req.t(transStrings.useralreadyexists),
      error: e,
    });
  }
};
const GetPokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const plan = await PokerPlan.findById(req.params.id);
  if (!plan) res.status(404).json({
    success:false,
    message:"Plan does not exist"
  });
  else {
    await plan.populate(`creator`);
    res.locals = {
      success: true,
      data: plan.json(),
    };
    next();
  }
};
const UpdatePokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const updates = req.body.data;
  const planId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!planId) res.status(400).json({success: false,message: "No plan identifier provided!"});
  try {
    const plan = await PokerPlan.findOneAndUpdate({ _id:planId },{ $set:updates },options);
    if (!plan) res.status(404).json({
      success: false,
      message:"Plan does not exist"
    });
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
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
const AddVenuesToPokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const venues = req.body.data;
  const planId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!planId) res.status(400).json({success: false,message: "No plan identifier provided!"});
  try{
    const plan = await PokerPlan.findOneAndUpdate({_id:planId},{$push:{venues:{$each:venues}}},options);
    if(!plan) res.status(404).json({success:false,message:"Plan does not exist"});
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
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
const UpdatePokerVenue:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const planId = req.params.id;
  const name = req.params.venueName;
  const options = {new:true,runValidators:true};
  const updates = {};
  if(!planId) res.status(400).json({success: false,message: "Invalid planId"});
  try {
    for(const k in req.body.data) updates['venues.$.'+k] = req.body.data[k];
    const plan = await PokerPlan.findOneAndUpdate({_id:planId,venues:{$elemMatch:{name}}},{$set:updates},options);
    if(!plan) res.status(404).json({success:false,message:"Plan does not exist"});
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
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
const RemoveVenueFromPokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const planId = req.params.id;
  const name = req.params.venueName;
  const options = {new:true,runValidators:true};
  if (!planId) res.status(400).json({success: false,message: "Invalid planId"});
  try {
    const plan = await PokerPlan.findOneAndUpdate({_id:planId},{$pull:{venues:{name}}},options);
    if (!plan) res.status(404).json({
      success: false,
      message:"Plan does not exist"
    });
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
      };
      next();
    }
  }
  catch(e){
    console.error(e);
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
const AddEntriesToPokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const entries = req.body.data;
  const planId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!planId) res.status(400).json({success: false,message: "No plan identifier provided!"});
  try{
    const plan = await PokerPlan.findOneAndUpdate({_id:planId},{$push:{entries:{$each:entries}}},options);
    if(!plan) res.status(404).json({success:false,message:"Plan does not exist"});
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
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
const UpdatePokerEntry:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const planId = req.params.id;
  const entryId = req.params.entryId;
  const options = {new:true,runValidators:true};
  const updates = {};
  if(!planId) res.status(400).json({success: false,message: "Invalid planId"});
  try {
    for(const k in req.body.data) updates['entries.$.'+k] = req.body.data[k];
    const plan = await PokerPlan.findOneAndUpdate({_id:planId,entries:{$elemMatch:{_id:entryId}}},{$set:updates},options);
    if(!plan) res.status(404).json({success:false,message:"Plan does not exist"});
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
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
const RemoveEntryFromPokerPlan:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const planId = req.params.id;
  const entryId = req.params.entryId;
  const options = {new:true,runValidators:true};
  if (!planId) res.status(400).json({success: false,message: "Invalid planId"});
  try {
    const plan = await PokerPlan.findOneAndUpdate({_id:planId},{$pull:{entries:{_id:entryId}}},options);
    if (!plan) res.status(404).json({
      success: false,
      message:"Plan does not exist"
    });
    else {
      await plan.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:plan.json()
      };
      next();
    }
  }
  catch(e){
    console.error(e);
    res.status(422).send({
      success: false,
      message:"Operation failed!",
      error:e,
    });
  }
};
export {
  CreatePokerPlan,
  GetPokerPlan,
  UpdatePokerPlan,
  AddVenuesToPokerPlan,
  UpdatePokerVenue,
  RemoveVenueFromPokerPlan,
  AddEntriesToPokerPlan,
  UpdatePokerEntry,
  RemoveEntryFromPokerPlan,
};