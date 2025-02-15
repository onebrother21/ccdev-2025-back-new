import Models from '../../models';
import Services from '../../services';
import Types from "../../types";
import Utils from '../../utils';

export class ProductMgmtController {
  static CreateProduct:IHandler = async (req,res,next) => {
    const user = req.user as Types.IUser;
    const role = user.role as Types.IProfileTypes;
    try {
      const { product } = await Services.Product.createProduct(user,role,req.body.data);
      res.locals = { status: 201, success: true, data: product.json() };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product update failed', error: e });
    }
  };
  static GetProduct:IHandler = async (req,res,next) => {
    Utils.logger.here();
    try {
      const {product} = await Services.Product.getProduct(req.params.productId);
      res.locals = { success: true, data: product.json() };
      next();
    } catch (e) {next(e);}
  };
  static UpdateProduct:IHandler = async (req,res,next) => {
    try {
      const { product } = await Services.Product.updateProduct(req.params.productId,req.body.data);
      res.locals = { success: true, data: product.json() };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product update failed', error: e });
    }
  };
  static DeleteProduct:IHandler = async (req,res,next) => {
    try {
      const { ok } = await Services.Product.deleteProduct(req.params.id);
      res.locals = { success: true, message: 'Product deleted' };
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Product deletion failed', error: e });
    }
  };
  static QueryProducts:IHandler = async (req,res,next) => {
    Utils.logger.here();
    try {
      const results = await Models.Product.find(req.query);
      res.locals = { success: true, data:{results:results.map((p) => p.json()) }};
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Failed to retrieve products', error: e });
    }
  };
  static QueryProductsByVendor:IHandler = async (req,res,next) => {
    try {
      const {results} = await Services.Product.queryByVendor(req.query.vendorId as string);
      res.locals = { success: true, data:{results:results.map((p) => p.json()) }};
      next();
    } catch (e) {
      res.status(422).json({ success: false, message: 'Failed to retrieve products', error: e });
    }
  };
  static QueryProductsByDetails:IHandler = async (req,res,next) => {
    try{
      const {q,s,o,t} = JSON.parse(req.query.q as string);
      const {results} = await Services.Product.queryProductsByDetails(q,s,o,t);
      res.locals = {success:true,data:{results}};
      next();
    } catch(e){ next(e); }
  }
}
export default ProductMgmtController;