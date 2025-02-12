import { AppError, calculateDistance, CommonUtils, logger } from '../utils';
import { Product } from '../models';
import * as AllTypes from "../types";

export class ProductsService {
  static createProduct = async (user:AllTypes.IUser,role:AllTypes.IProfileTypes,newProduct:Partial<AllTypes.IProduct>) =>  {
    const profile = user.profiles[role] as AllTypes.IVendor;
    const product = new Product({creator:profile.id,creatorRef:role+"s",location:profile.location,...newProduct});
    await product.save();
    await product.populate("creator");
    return {product};
  }
  static getProduct = async (productId:string) => {
    const product = await Product.findById(productId);
    if(!product) throw new AppError(422,'Requested product not found');
    await product.populate("creator");
    return {product};
  }
  static updateProduct = async (productId:string,updates:any) => {
    const product = await Product.findByIdAndUpdate(productId,{ $set: updates },{new:true,runValidators:true});
    if (!product) throw new AppError(422,'Requested product not found');
    await product.populate("creator");
    return {product};
  };
  static deleteProduct = async (productId:string) => {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) throw new AppError(422,'Requested product not found');
    return {ok:true};
  };
  static queryByVendor = async (vendorId:string) => {
    const products = await Product.find({ creator:vendorId });
    return {results:products};
  };
  static queryProductsByDetails = async ({location,...query_}:any,select:string[],opts?:any,timestamp?:number) => {
    const page = opts?.currentPage || 1; // Default to page 1
    const limit = opts?.limit || 10; // Default to 10 results per page
    const skip = (page - 1) * limit; // Calculate how many records to skip
    const sortField = opts?.sort || 'createdOn';
    const sortOrder = opts?.order || -1;

    const {pts,radius = 5,unit = "mi"} = location || {};
    const searchRadius = radius/(unit == "mi"?3963.2:6371);
    const locationQ = {location:{"$geoWithin":{"$centerSphere":[pts,searchRadius]}}};

    const query = {...query_,...(location?locationQ:{})};
    const pipeline = [];
    
    pipeline.push(
      { $lookup: {from: "admins",localField: "creator",foreignField: "_id",as: "adminCreators"}},
      { $lookup: {from: "vendors",localField: "creator",foreignField: "_id",as: "vendorCreators"}},
      { $set: {creator: {$mergeObjects: [{ $first: "$adminCreators" },{ $first: "$vendorCreators" }]}}},
      { $unset: ["adminCreators", "vendorCreators"] },
      { $addFields: {
        created_on: { "$toDouble": "$createdOn" },
        received_on: { "$toDouble": "$receivedOn" },
        expires_on: { "$toDouble": "$expiration" },
        status: {$arrayElemAt:["$statusUpdates.name",-1]}//last status update
      }},
      { $match: query },
      { $group: {
        _id: "$_id",
        creator: { $first: "$creator" },
        createdOn: { $first: "$createdOn" },
        expiration: { $first: "$expiration" },
        name:{ $first:"$name" },
        status: { $first: "$status" },
        loc:{ $first:"$location.coordinates"},
        rating:{$first:"$rating"},
        type:{$first:"$type"},
        price:{$first:"$price"},
        reviews:{$first:"$reviews"},
      }},
      { $skip: skip },
      { $limit: limit },
      { $sort: { [sortField]: sortOrder } },  // Sorting stage
      { $project: {
        _id: 0,
        ...(select.includes("id")?{id:"$_id"}:{}),
        ...(select.includes("status")?{status:1}:{}),
        ...(select.includes("type")?{type:1}:{}),
        ...(select.includes("name")?{name:1}:{}),
        ...(select.includes("createdOn")?{createdOn:1}:{}),
        ...(select.includes("expiration")?{expiration:1}:{}),
        ...(select.includes("loc")?{loc:1}:{}),
        ...(select.includes("rating")?{rating:1}:{}),
        ...(select.includes("ratingCt")?{ratingCt:{ $size:"$reviews"}}:{}),
        ...(select.includes("price")?{price:"$price.amt"}:{}),
        ...(select.includes("priceUnit")?{priceUnit:{ $concat: [ "$price.curr","/","$price.per" ] }}:{}),
        ...(select.includes("creator")?{creator: { id: "$creator._id",name: "$creator.name",username:"$creator.displayName" }}:{}),
      }}
    );
    const results_ = await Product.aggregate(pipeline);
    const results = !location?results_:results_.map(o => ({
      ...o,
      ...(select.includes("dist")?{dist:calculateDistance(pts,o.loc,{unit,toFixed:4})}:{}),
      ...(select.includes("distUnit")?{distUnit:unit}:{}),
    }));
    results.sort(CommonUtils.sortBy("dist"));
    return { results };
  };
}