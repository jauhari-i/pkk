const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/db");
const port = 3000;

if (app.use(db)) {
    console.log("Database terkoneksi")
  } else {
    console.log("Database tidak terkoneksi")
  }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", require("./route/routes"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));