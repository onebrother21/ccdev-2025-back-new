export const PageNotFound:IHandler = (req,res) => {
  res.status(404).json({
    success:false,
    message:"resource not found"
  });
};
export default PageNotFound;