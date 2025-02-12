import { ProductsService } from '../../services';
import { Product } from '../../models';
import { AppError, logger } from '../../utils';
import * as AllTypes from "../../types";

export class ProductMgmtController {
  static CreateProduct:IHandler = async (req,res,next) => {
    const user = req.user as AllTypes.IUser;
    const role = user.role as AllTypes.IProfileTypes;
    try {
      const { product } = await ProductsService.createProduct(user,role,req.body.data);
      res.locals = { status: 201, success: true, data: product.json() };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product update failed', error: e });
    }
  };
  static GetProduct:IHandler = async (req,res,next) => {
    logger.here();
    try {
      const {product} = await ProductsService.getProduct(req.params.productId);
      res.locals = { success: true, data: product.json() };
      next();
    } catch (e) {next(e);}
  };
  static UpdateProduct:IHandler = async (req,res,next) => {
    try {
      const { product } = await ProductsService.updateProduct(req.params.productId,req.body.data);
      res.locals = { success: true, data: product.json() };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product update failed', error: e });
    }
  };
  static DeleteProduct:IHandler = async (req,res,next) => {
    try {
      const { ok } = await ProductsService.deleteProduct(req.params.id);
      res.locals = { success: true, message: 'Product deleted' };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product deletion failed', error: e });
    }
  };
  static QueryProducts:IHandler = async (req,res,next) => {
    logger.here();
    try {
      const results = await Product.find(req.query);
      res.locals = { success: true, data:{results:results.map((p) => p.json()) }};
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Failed to retrieve products', error: e });
    }
  };
  static QueryProductsByVendor:IHandler = async (req,res,next) => {
    try {
      const {results} = await ProductsService.queryByVendor(req.query.vendorId as string);
      res.locals = { success: true, data:{results:results.map((p) => p.json()) }};
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Failed to retrieve products', error: e });
    }
  };
  static QueryProductsByDetails:IHandler = async (req,res,next) => {
    try{
      const {q,s,o,t} = JSON.parse(req.query.q as string);
      const {results} = await ProductsService.queryProductsByDetails(q,s,o,t);
      res.locals = {success:true,data:{results}};
      next();
    } catch(e){ next(e); }
  }
}
export default ProductMgmtController;