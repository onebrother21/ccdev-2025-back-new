import { CommonUtils } from '../utils';

const DecryptData:IHandler = (req,res,next) => {
  try {
    const isPostOrPut = ["post","put","patch"].includes(req.method.toLowerCase());
    const encryptedData = isPostOrPut && req.body.data;
    const {data} = req.body;
    const {query} = req.query;
    if(!isPostOrPut) next();
    else if(!encryptedData) {
      res.status(400).json({succes:false,message: 'No encrypted data provided' });
    }
    else {
      req.body.data = CommonUtils.decrypt(data);
      next();
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:'Decryption failed',
      error: error.message
    });
  }
};
const EncryptData:IHandler = (req, res,next) => {
  try {
    if(res.locals.data) res.locals.data = CommonUtils.encrypt(res.locals.data);
    next();
  }
  catch (error) {
    res.status(500).json({
      success:false,
      message:'Encryption failed',
      error:error.message
    });
  }
};

export {
  DecryptData,
  EncryptData,
};