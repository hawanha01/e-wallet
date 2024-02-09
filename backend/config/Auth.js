module.exports = {
  enusureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please Login in to View this resource");
    res.redirect("/users/login");
  },
};
