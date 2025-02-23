export const SetResponseCorsHeaders:() => IHandler = () => async (req, res, next) => {
  if(req.headers.origin) res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};
export default SetResponseCorsHeaders;