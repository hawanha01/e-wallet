const express = require("express");
const router = express.Router();
const { enusureAuthenticated } = require("../config/Auth");
// Get methods
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) =>
  res.render("registration", { errors: undefined })
);
router.get("/", (req, res) => res.render("welcome"));
// protected from without login access
router.get("/dashboard", enusureAuthenticated, (req, res) =>{
  
  res.render("dashboard")
}
);

module.exports = router;
