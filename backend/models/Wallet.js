const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0.0,
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

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
