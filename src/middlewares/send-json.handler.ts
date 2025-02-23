export const SendJson:() => IHandler = () => (req,res,next) => {
  const {
    status,
    success,
    message,
    error,
    data,
    token,
    csrfToken
  } = res.locals;
  if(success) res.status(status || 200).json({
    success,
    message,
    error,
    data,
    ...(token?{token}:{}),
    csrfToken
  });
  else {
    // console.warn(res.locals);
    next();
  }
};
export default SendJson;