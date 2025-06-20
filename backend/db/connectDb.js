const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(uri, options)
    .then(() => {
      console.log(`Database Connected.`);
    })
    .catch(() => {
      console.log(`Database Not Connected.`);
    });
}

module.exports = connectDB;
