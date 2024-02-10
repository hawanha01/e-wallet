const express = require("express");
const app = express();
const userRoutes = require("./Users");

app.use("/users", userRoutes);

module.exports = app;
