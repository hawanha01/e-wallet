const express = require("express");
const app = express();
const homeRoutes = require("./Home");
const userRoutes = require("./Users");

app.use("/users", userRoutes);
app.use("/", homeRoutes);

module.exports = app;
