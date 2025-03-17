const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");

app.use(express.json());
//routes
app.use("/api/v1", user);

app.get("/", (req, res) => {
  res.send("Hello World");});

//creating port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

