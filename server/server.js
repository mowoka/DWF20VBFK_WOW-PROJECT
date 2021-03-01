const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const router = require("./src/routes");

const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Api is Working");
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}, App Ready`);
});
