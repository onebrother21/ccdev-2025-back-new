import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const concentrationSchema = new Schema<Types.IProduct["concentration"]>({
  amt:{type:Number,required:true},
  unit:{type:String,required:true},
},{_id:false,timestamps:false});
const priceSchema = new Schema<Types.IProduct["price"]>({
  amt:{type:Number,required:true},
  curr:{type:String,required:true,enum:Utils.currencyCodes},
  per:{type:String,required:true},
},{_id:false,timestamps:false});
const reviewSchema = new Schema<Types.IProductReview>({
  user: { type: ObjectId, ref: 'customers', required: true },
  score: { type: Number,enum:[1,2,3,4,5],required:true },
  title: { type: String },
  content: { type: String },
  time: { type: Date, default: Date.now },
  slug: { type: String,default:() => Utils.shortId()},
},{_id:false,timestamps:false});

const productSchema = new Schema<Types.IProduct,Product,Types.IProductMethods>({
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IProductStatuses),Types.IProductStatuses.COMING_SOON),
  creator:{type:ObjectId,ref:"users",required:true},
  name:{type:String,required:true},
  concentration:{type:concentrationSchema,required:true},
  price:{type:priceSchema,required:true},
  description:{type:String,maxlength:140},
  kind:{type:String},
  type:{type:String},
  origin:{type:String,enum:[...Utils.stateAbbreviations]},
  placeOfOrigin:{type:String,enum:[...Utils.stateAbbreviations]},
  dateOfOrigin:{type:Date},
  sku:{type:String},
  expiration:{type:Date},
  reviews: [reviewSchema],
  rating:{type:Number},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  vendors:[{type:ObjectId,ref:"vendors",required:true}],
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
productSchema.plugin(uniqueValidator);
productSchema.index({location:"2dsphere"});
productSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
productSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
productSchema.methods.addReview = async function(review:Types.IProductReview,save?:boolean) {
  const ratingCt = this.reviews.length;
  this.rating = ((this.rating || 0) * ratingCt + review.score)/(ratingCt + 1);
  this.reviews.push(review);
  if(save) await this.save();
};
productSchema.methods.removeReview = async function(review:Types.IProductReview,save?:boolean) {
  const ratingCt = this.reviews.length;
  this.rating = ((this.rating || 0) * ratingCt - review.score)/(ratingCt - 1);
  this.reviews = this.reviews.filter(o => o.slug !== review.slug);
  if(save) await this.save();
};
productSchema.virtual('ratingCt').get(function (){return this.reviews.length;});
productSchema.virtual('reviewCt').get(function (){return this.reviews.filter(o => !!o.title).length;});
productSchema.methods.json = function () {
  try{
    const json:Partial<Types.IProduct> =  {};
    json.id = this.id;
    json.createdOn = this.createdOn;
    json.creator = this.creator;
    json.status = this.status;
    json.name = this.name;
    json.description = this.description;
    json.type = this.type;
    json.kind = this.kind;
    json.origin = this.origin;
    json.placeOfOrigin = this.placeOfOrigin;
    json.dateOfOrigin = this.dateOfOrigin;
    json.sku = this.sku;
    json.concentration = this.concentration;
    json.price = this.price;
    json.expiration = this.expiration;
    json.reviewCt = this.reviewCt;
    json.ratingCt = this.ratingCt;
    json.rating = this.rating;
    json.vendorCt= this.vendors.length;
    json.info = this.info;
    return json as Types.IProduct;
  } catch(e){Utils.logger.error(e);throw e;}
};

type Product = Model<Types.IProduct,{},Types.IProductMethods>;
const Product:Product = mongoose.model<Types.IProduct>('products',productSchema);
export default Product;