const express = require("express");
const { User, Wallet } = require("../models");
const router = express.Router();

router.get("/balance", async (req, res) => {
  const userID = req.query.userID;

  if (!userID) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const user = await User.findByPk(userID);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wallet = await Wallet.findByPk(user.walletId);

    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    res.status(200).json({ success: true, message: "Wallet found", wallet });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

module.exports = router;
