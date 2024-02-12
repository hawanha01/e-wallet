const express = require("express");
const app = express();
const userRoutes = require("./Users");
const walletRoutes = require("./wallet");

app.use("/users", userRoutes);
app.use("/wallet", walletRoutes);

module.exports = app;
