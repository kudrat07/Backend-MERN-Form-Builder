const express = require("express");
const app = express();
const dbConnect = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

//middleware to parse json
app.use(express.json());

app.use(cors());

// db connection call
dbConnect();

const userRouter = require("./routes/routes");
app.use("/api/v1", userRouter);

app.listen(PORT, () => {
  console.log("Server is up and running on port", PORT);
});

app.use("/", (req, res) => {
  res.send(`<h1>This is homepage baby</h1>`);
});
