const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^\d{13}$/.test(value);
      },
      message: "CNIC must be a 13-digit number.",
    },
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^\d{11}$/.test(value);
      },
      message: "Phone number must be an 11-digit number.",
    },
  },
  profileImage: {
    type: String,
  },
  address: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
