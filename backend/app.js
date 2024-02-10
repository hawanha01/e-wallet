const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const router = require("./routes/index");
const dbConfig = require("./config/DBConfig");
require("dotenv").config();
require("./config/Passport")(passport);
const PORT = process.env.PORT || 3000;
const app = express();

// Mongoo DB connection
dbConfig();

// cors enable
app.use(cors());

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Flash Setup
app.use(flash());

// body parser Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// EJS Setup
// app.use(expressLayouts);
// app.set("views", path.resolve(__dirname, "views"));
// app.set("view engine", "ejs");

// Global var
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   next();
// });

// routes
app.use("/", router);

app.listen(PORT, console.log(`server started on the PORT: ${PORT}`));
