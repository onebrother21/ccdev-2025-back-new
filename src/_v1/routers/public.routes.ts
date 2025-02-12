import express from 'express';
import { SendJson } from '../../middlewares';
import { CommonUtils } from '../../utils';

const router = express.Router();
router.get("/hm",(req,res,next) => {
  res.locals = {
    ...res.locals,
    success:true,
    message:"ready",
  };
  next();
});
router.get("/connect",(req,res,next) => {
  res.locals = {
    ...res.locals,
    success:true,
    message:"ready",
  };
  next();
});
router.get('/decrypt',(req, res) => {
  try {
    const {encryptedData} = req.body;
    if (!encryptedData) {
      res.status(400).json({
        success:false,
        message:'No encrypted data provided'
      });
    }
    else {
      const decryptedData = CommonUtils.decrypt(encryptedData);
      res.json({success:true,...decryptedData});
    }
  }
  catch (error) {
    res.status(500).json({
      success:false,
      error:'Decryption failed',
      details:error.message
    });
  }
});
router.get('/encrypt',(req, res) => {
  try {
    const data = { message: 'This is sensitive data' };
    const encryptedData = CommonUtils.encrypt(data);
    res.json({success:true,data:encryptedData});
  }
  catch (error) {
    res.status(500).json({
      success:false,
      message:'Encryption failed',
      error: error.message
    });
  }
});

export default router;