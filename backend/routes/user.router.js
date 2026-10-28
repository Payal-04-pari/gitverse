const expresss=require("express");
const userController=require("../controllers/userController");
const userRouter=expresss.Router();

userRouter.get("/allUsers",userController.getAllusers);
userRouter.post("/signup",userController.signup);
userRouter.post("/login",userController.login);
userRouter.get("/profile/:id",userController.getUserProfile);
userRouter.put("/updateprofile/:id",userController.updateUserProfile);
userRouter.delete("/deleteprofile",userController.deleteUserProfile);
module.exports=userRouter;