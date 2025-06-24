const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/MCA";

function connectDB() {
  mongoose
    .connect(uri)
    .then(() => {
      console.log(`Database Connected.`);
    })
    .catch(() => {
      console.log(`Database Not Connected.`);
    });
}

module.exports = connectDB;
