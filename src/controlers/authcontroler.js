
import { User } from "../models/user.model.js";
import {  transporter } from "../config/email.js";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";



export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    console.log("email", email);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        role: "user",
      });
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    console.log("generated otp", otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: "ramam@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    console.log("email:", email, "otp:", otp);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // OTP check
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Expiry check
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    // OTP remove after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    // Token generate
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};