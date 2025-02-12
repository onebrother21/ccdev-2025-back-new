import express from 'express';
import { productController } from '../controllers';
import { productValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();
router.post("/",[AuthJWT,...productValidators.CreateProduct,productController.CreateProduct]);
router.get("/:productId",[AuthJWT,productController.GetProduct]);
router.put("/:productId",[AuthJWT,...productValidators.UpdateProduct,productController.UpdateProduct]);
router.delete("/:productId",[AuthJWT,productController.UpdateProduct]);
router.delete("/:productId/x",[AuthJWT,productController.UpdateProduct]);

export default router;