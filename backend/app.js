const express = require("express");
const app = express();
const condnectDb = require("./db/connectDb");
const PORT = 5000;

connectDB();

app.listen(PORT, (req, res) => {
  console.log(`Server is Running on http://localhost:${PORT}/`);
});
