const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userauth");

//Sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    if (!username || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should be of atleast 4 characters" });
    }
    //check if username already exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    //check if email already exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //check if password is of atleast 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be of atleast 6 characters" });
    }
    //hash the password
    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signup successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Sign in
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //check if password is correct
    const isValid = await bcrypt.compare(
      password,
      existingUser.password,
      (err, data) => {
        if (err) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
        if (data) {
          const authClaims = [
            { name: existingUser.username },
            { role: existingUser.role },
          ];

          //generate token
          const token = jwt.sign({ authClaims }, "bookStore123", {
            expiresIn: "30d",
          });
          return res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            token: token,
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//get-user-info
router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//update-user-info
router.put("/update-user-info", authenticateToken, async (req, res) => {
  try {
    const{ id } = req.headers;
    const { username, email, address } = req.body;
    if (!username || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, {
      username: username,
      email: email,
      address: address,
    });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
