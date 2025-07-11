const express = require("express");
const router = express.Router();
const postModel = require("./../models/Post");

// GET - /
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs & MongoDB",
    };
    const data = await postModel.find({});
    res.render("index", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// GET - /post/:id
router.get("/post/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const data = await postModel.findById({ _id: id });
    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs & MongoDB",
    };
    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// POST - Post -search term
router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    console.log(searchTerm);
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await postModel.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs & MongoDB",
    };
    res.render("search", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

// function insertPostData() {
//   postModel.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic.",
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan.",
//     },
//   ]);
// }
// insertPostData()
