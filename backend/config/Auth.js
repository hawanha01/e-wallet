module.exports = {
  enusureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
  },
};
