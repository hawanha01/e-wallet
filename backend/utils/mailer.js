const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { UserOTPVerification } = require("../models");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SOFTWARE_EMAIL,
    pass: process.env.SOFTWARE_EMAIL_PASS,
  },
});

const sendOTPToUser = async (userId, userEmail, userName) => {
  try {
    const otp = `${Math.floor(Math.random() * 10000)}`;
    const mailOptions = {
      from: process.env.SOFTWARE_EMAIL,
      to: userEmail,
      subject: "Email Verification",
      html: `<p>Dear ${userName}</p> <p>Enter <b>${otp}</b> in the app to verify your email address and complete the verification.</p><p>This code expire in <b>1 hour</b></p><p><b>Thank you!</b></p><p>Best regards,</p><p>Mobile Wallet</p>`,
    };
    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTPVerification = new UserOTPVerification({
      userId: userId,
      otp: hashedOTP,
      createdAt: Date.now(),
      expireAt: Date.now() + 3600000,
    });
    await newOTPVerification.save();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendOTPToUser };
