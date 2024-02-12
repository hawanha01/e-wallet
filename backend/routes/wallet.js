const express = require("express");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const router = express.Router();
router.get("/balance", (req, res) => {
  const userID = req.query.userID;
  User.findOne({ _id: userID }).then((user) => {
    if (!user.wallet) {
      res.status(404).json({ success: false, message: "Wallet Not Found" });
    } else {
      Wallet.findById(user.wallet).then((wallet) => {
        res
          .status(201)
          .json({ success: true, message: "Wallet found", wallet });
      });
    }
  });
});
module.exports = router;
