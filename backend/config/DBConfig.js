const mongoose = require("mongoose");
const db = require("./Keys").mongoURI;

async function connectToDB() {
  try {
    await mongoose.connect(db, { maxPoolSize: 10 });
    console.log("connected");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
module.exports = connectToDB;
