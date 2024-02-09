const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");
const { sendOTPToUser } = require("../utils/mailer");
const UserOTPVerification = require("../models/UserOTPVerification");

// Get methods
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("registration"));
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) throw err;
    req.flash("success_msg", "you are logout");
    res.redirect("/users/login");
  });
});
router.get("/resendOTP", async (req, res) => {
  try {
    let userID = req.query.userID;
    if (userID === "") {
      return res.render("OTPVerify", {
        errors: "Empty values are not allowed",
        userID,
      });
    }
    await UserOTPVerification.deleteMany({ userId: userID });
    const user = await User.findOne({ _id: userID });
    sendOTPToUser(userID, user.email, user._id);
    return res.render("OTPVerify", { userID });
  } catch (e) {
    console.log(e);
  }
});

// Post methods
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.post("/register", (req, res) => {
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
    name === "" ||
    email === "" ||
    gender === "" ||
    cnic === "" ||
    profileImage === "" ||
    contact === "" ||
    address === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    req.flash("error_msg", "All field must be field");
    return res.redirect("/users/register");
  }
  if (name.length < 2) {
    req.flash("error_msg", "Name is too short at least 2 characters required");
    return res.redirect("/users/register");
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    req.flash("error_msg", "Email format not correct");
    return res.redirect("/users/register");
  }
  if (!/^\d{13}$/.test(cnic)) {
    req.flash("error_msg", "CNIC Not correct");
    return res.redirect("/users/register");
  }
  if (!/^\d{11}$/.test(contact)) {
    req.flash("error_msg", "Contact Not correct");
    return res.redirect("/users/register");
  }
  if (address.length < 1) {
    req.flash("error_msg", "Address required");
    return res.redirect("/users/register");
  }
  if (profileImage.length < 1) {
    req.flash("error_msg", "Profile Image required");
    return res.redirect("/users/register");
  }
  if (password !== confirmPassword) {
    req.flash("error_msg", "Password mismatched");
    return res.redirect("/users/register");
  }
  User.findOne({ email: email }).then((user) => {
    if (user) {
      req.flash("error_msg", "user already Exist");
      return res.redirect("/users/register");
    } else {
      const newUser = new User({
        name,
        email,
        gender,
        password,
        cnic,
        contact,
        profileImage,
        address,
      });
      bcrypt.genSalt(10, (error, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(() => {
              sendOTPToUser(newUser._id, newUser.email, newUser.name);
              return res.render("OTPVerify", { userID: newUser._id });
            })
            .catch((e) => {
              req.flash("error_msg", "You are not registered");
              console.log(e);
              return res.redirect("/users/register");
            });
        })
      );
    }
  });
});

router.post("/otpVerify", async (req, res) => {
  const { userID, otp } = req.body;
  try {
    if (userID === "" || otp === "") {
      return res.render("OTPVerify", {
        errors: "Empty values are not allowed",
        userID,
      });
    }
    const userOTPVerificationRecord = await UserOTPVerification.findOne({
      userId: userID,
    });
    if (!userOTPVerificationRecord) {
      req.flash(
        "error_msg",
        "Account Record doesn't exist maybe already verified"
      );
      return res.redirect("/users/login");
    } else {
      const { expireAt } = userOTPVerificationRecord;
      const hashedOTP = userOTPVerificationRecord.otp;
      if (expireAt < Date.now()) {
        await UserOTPVerification.deleteMany({ userID });
        return res.render("OTPVerify", {
          errors: "Code is expired Request again for verification code",
          userID,
        });
      } else {
        bcrypt
          .compare(otp, hashedOTP)
          .then(async (validOTP) => {
            if (!validOTP) {
              return res.render("OTPVerify", { error: "Wrong OTP", userID });
            } else {
              await User.updateOne({ _id: userID }, { verified: true });
              await UserOTPVerification.deleteMany({ userId: userID });
              req.flash("success_msg", "Email Verified successfully");
              return res.redirect("/users/login");
            }
          })
          .catch((e) => console.log(`OTP Comparison time error: ${e}`));
      }
    }
  } catch (e) {
    req.flash("error_msg", `Something wrong server error: ${e}`);
    return res.redirect("/users/login");
  }
});

module.exports = router;
