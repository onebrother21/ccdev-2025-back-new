import { Product } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';

const CreateProduct:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const data = req.body.data;
  const product = new Product({creator:req.user.id,...data});
  try {
    await(await product.save()).populate(`creator`);
    res.locals = {
      status:201,
      success:true,
      data:product.json(),
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
const GetProduct:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const product = await Product.findById(req.params.id);
  if (!product) res.status(404).json({success:false,message:"Product does not exist"});
  else {
    await product.populate(`creator`);
    res.locals = {
      success:true,
      data:product.json(),
    };
    next();
  }
};
const UpdateProduct:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const $set = req.body.data;
  const productId = req.params.id;
  const options = {new:true,runValidators:true};
  if (!productId) res.status(400).json({success: false,message: "No product identifier provided!"});
  try {
    const product = await Product.findByIdAndUpdate(productId,{ $set },options);
    if (!product) res.status(404).json({
      success: false,
      message:"Product does not exist"
    });
    else {
      await product.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:product.json()
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
const MarkProductAsDeleted:IHandler = async (req,res,next) => {
  const role = req.user.role;
  const productId = req.params.id;
  const opts = {new:true,runValidators:true};
  if (!productId) res.status(400).json({success: false,message: "No product identifier provided!"});
  try {
    const product = await Product.findOneAndUpdate({ _id:productId },{$set:{status:{name:"deleted",time:new Date()}}},opts);
    if (!product) res.status(404).json({
      success: false,
      message:"Product does not exist"
    });
    else {
      await product.populate(`creator`);
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:product.json()
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
const DeleteProduct:IHandler = async (req,res,next) => {
  const productId = req.params.id;
  if(!productId) res.status(400).json({success: false,message: "No product identifier provided!"});
  try {
    const product = await Product.findByIdAndDelete(productId);
    if(!product) res.status(404).json({success: false,message:"Product does not exist"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:product?{deleted:productId,ok:true}:null
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

/** ADD PRODUCT AGGREGATE METHOD
 * - aggregate products
 * - unwind vendors
 * - match vendors by location
 * - match vendor by hours of operations
 * - match vendor by rating
 * - match prodcut by rating
 * - sort by "closeness","openNow","vendorRating","productRating"
 * - project product details, vendor details
*/
const QueryProductsByVendorDetails:IHandler = async (req,res,next) => {next();}
export {
  CreateProduct,
  GetProduct,
  UpdateProduct,
  MarkProductAsDeleted,
  DeleteProduct,
};