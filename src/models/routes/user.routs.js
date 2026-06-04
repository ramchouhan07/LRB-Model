import { Router } from "express";
import { LoginUser, refreshAccessToken, registerUser } from "../../controlers/admin.controler.js";
import { upload } from "../../middlewarse/multer.js";
import { verifyOtp, sendOtp } from "../../controlers/authcontroler.js"

const  router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1

        }
    ]),
    registerUser
)
//secure routs
router.route("/login").post(LoginUser)
router.route("/refresh-access-token").post(refreshAccessToken)


//for user login by email and otp
router.route("/loginuser").post(sendOtp)
router.route("/verifyuser").post(verifyOtp)

// alias endpoints for consistency
router.route("/send-otp").post(sendOtp)
router.route("/verify-otp").post(verifyOtp)



export default router;