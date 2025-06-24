const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

const condnectDb = require("./db/connectDb");
const routes = require("../backend/routes/index");

const BUILD = "dev";

app.use(cors());
app.use(morgan(BUILD));
app.use(express.urlencoded({ extended: true }));
app.use(routes);
const PORT = 5000;

condnectDb();

app.listen(PORT, (req, res) => {
  console.log(`Server is Running on http://localhost:${PORT}/`);
});
