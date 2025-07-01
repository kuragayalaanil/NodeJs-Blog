const express = require("express");
const router = express.Router();
const postModel = require("./../models/Post");
const userModel = require("./../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

// Check Login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorised",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised",
    });
  }
};

// GET - / admin - Login Page

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog create with NodeJs & MongoDB",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// POST - Check Login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send({
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// Get - Admin Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await postModel.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// POST - Admin - Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    try {
      const user = await userModel.create({
        username,
        password: hashPassword,
      });
      res.status(201).send({
        message: "User Created",
        user,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({
          message: "User already in use",
        });
      }
      res.status(500).send({
        message: "Internal server error",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Get - Admin - create New Post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDB",
    };
    const data = await postModel.find();
    res.render("admin/add-post", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Post - Admin create
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = await postModel.create({
        title: req.body.title,
        body: req.body.body,
      });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
