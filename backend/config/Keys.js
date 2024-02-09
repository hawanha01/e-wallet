require("dotenv").config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.MONGOO_USERNAME}:${process.env.MONGOO_PASSWORD}@firstcluster.lf0obsu.mongodb.net/?retryWrites=true&w=majority`,
};
