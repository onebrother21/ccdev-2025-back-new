import { Router } from 'express';
import { SendJson } from '../../middlewares';
import Utils from '../../utils';

const AppPublicRouter = Router();

AppPublicRouter.get("/hm",(req,res) => {res.json({success:true,message:"ready"});});
AppPublicRouter.get("/connect",(req,res) => {res.json({success:true,message:"ready",csrfToken:res.locals.csrfToken});});
AppPublicRouter.get('/decrypt',(req, res) => {
  try {
    const {encryptedData} = req.body;
    if (!encryptedData) {
      res.status(400).json({
        success:false,
        message:'No encrypted data provided'
      });
    }
    else {
      const decryptedData = Utils.decrypt(encryptedData);
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
AppPublicRouter.get('/encrypt',(req, res) => {
  try {
    const data = { message: 'This is sensitive data' };
    const encryptedData = Utils.encrypt(data);
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

export default AppPublicRouter;