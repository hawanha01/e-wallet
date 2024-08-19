const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");
const { sendOTPToUser } = require("../utils/mailer");
const { User, UserOTPVerification, Wallet } = require("../models");

// router.get(":userID", async (req, res) => {
//   const id = req.query.userID;
//   try {
//     const user = await User.findOne({ _id: id });
//     if (user._id === id) {
//       res.status(201).json({ success: true, message: "User found", user });
//     }
//   } catch (e) {
//     res.status(401).json({ success: false, message: "User Not found" });
//   }
// });

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.status(500).json({ success: false, message: "Error during logout" });
    }
    req.session.destroy();
    res.status(200).json({ success: true, message: "logout successfully" });
  });
});

router.get("/resendOTP", async (req, res) => {
  try {
    let userID = req.query.userID;
    if (userID === "") {
      res
        .status(400)
        .json({ success: false, message: "Empty values are not allowed" });
    }
    await UserOTPVerification.destroy({ where: { userId: userID } });
    const user = await User.findByPk(userID);
    sendOTPToUser(userID, user.email, user.name);
    res
      .status(200)
      .json({ success: true, message: "OTP again send successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error: ${e.message}` });
  }
});

// Post methods
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      req.session.user = user;
      return res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    gender,
    cnic,
    profileImage,
    contact,
    address,
    password,
    confirmPassword,
  } = req.body;

  if (
    !name ||
    !email ||
    !gender ||
    !cnic ||
    !profileImage ||
    !contact ||
    !address ||
    !password ||
    !confirmPassword
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });
  }

  if (
    name.length < 2 ||
    !/\S+@\S+\.\S+/.test(email) ||
    !/^\d{13}$/.test(cnic) ||
    !/^\d{11}$/.test(contact) ||
    address.length < 1 ||
    profileImage.length < 1 ||
    password !== confirmPassword
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Credentials" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const createdWallet = await Wallet.create({});
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      gender,
      password: hashedPassword,
      cnic,
      contact,
      profileImage,
      address,
      walletId: createdWallet.id,
    });

    sendOTPToUser(newUser.id, newUser.email, newUser.name);
    res
      .status(201)
      .json({ success: true, message: "User registered", userID: newUser.id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/otpVerify", async (req, res) => {
  const { userID, otp } = req.body;
  try {
    if (userID === "" || otp === "") {
      res.status(400).json({
        success: false,
        message: "Empty values are not allowed",
      });
    }
    const userOTPVerificationRecord = await UserOTPVerification.findOne({
      where: { userId: userID },
    });
    if (!userOTPVerificationRecord) {
      res.status(401).json({
        success: false,
        message: "Account Record doesn't exist maybe already verified",
      });
    } else {
      const { expireAt } = userOTPVerificationRecord;
      const hashedOTP = userOTPVerificationRecord.otp;
      if (expireAt < Date.now()) {
        await UserOTPVerification.destroy({ where: { userId: userID } });
        res.status(400).json({
          success: false,
          message: "Code is expired Request again for verification code",
        });
      } else {
        bcrypt
          .compare(otp, hashedOTP)
          .then(async (validOTP) => {
            if (!validOTP) {
              res.status(400).json({
                success: false,
                message: "Wrong OTP",
              });
            } else {
              await User.update({ verified: true }, { where: { id: userID } });
              await UserOTPVerification.destroy({ where: { userId: userID } });
              res.status(200).json({
                success: true,
                message: "Email Verified",
              });
            }
          })
          .catch((e) => {
            res.status(500).json({
              success: false,
              message: `Internal Server Error: ${e.message}`,
            });
          });
      }
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});

module.exports = router;
