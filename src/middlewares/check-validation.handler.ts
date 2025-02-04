import { validationResult } from "express-validator";

const CheckValidation:IHandler = (req, res,next) => {
  const result = validationResult(req);
  if (result.isEmpty()) next();
  else res.status(400).json({
    success:false,
    message:"Check you data!",
    errors: result.array()
  });
};
export default CheckValidation;