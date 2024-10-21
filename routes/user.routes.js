const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const Project = require ("../models/Project.model")
const Event = require("../models/Event.model")
const { isAuthenticated } = require("../middleware/jwt.middleware");



//* ROUTES GET
// GET /api/user/ -> all users
router.get("/", async (req, res, next)=>{
  User.find({})
  try {
    const response = await User.find()
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

// GET /api/user/profile -> user details with id
router.get("/profile", isAuthenticated, async (req, res, next)=>{
  try {
    const response = await User.findById(req.payload._id);
    res.status(200).json(response);
  } catch (error) {
    next(error)
  }
})

// GET /api/user/profile/:username -> user details with id
router.get("/profile/:username", async (req, res, next)=>{
  try {
    const response = await User.findOne({ username: req.params.username });
    res.status(200).json(response);
  } catch (error) {
    next(error)
  }
})

// GET /api/user/project/:projectid -> all project's users
router.get("/project/:projectid", async (req, res, next) => {
  try {
    
    const project = await Project.findById(req.params.projectid)
      .populate("owner", "profilePicture username ") 
      .populate("teamMembers", "profilePicture username"); 

    const users = {
        owner: project.owner,
        teamMembers: project.teamMembers
    };

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/user/event/:eventid -> event's users (owner and speaker)
router.get("/event/:eventid", async (req,res,next) => {
  try {
    const event = await Event.findById(req.params.eventid)
    .populate("owner", "profilePicture username ") 
    .populate("lecturer", "profilePicture username"); 

    const users = {
      owner: event.owner,
      lecturer: event.lecturer
    }
    res.status(200).json(users);
  } catch (error) {
    next(error)
  }
})


// GET api/user/:userid/project/owned -> which projects a user owns
router.get("/:userid/project/owned", async (req, res, next)=>{
  try {
    const userid = req.params.userid;
    const projects = await Project.find({ owner: userid })

    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
})


//* ROUTES PUT
// PUT /api/user/:userid -> edit user
router.put("/:userid", isAuthenticated, async (req, res, next) =>{
  try {
    const response = await User.findByIdAndUpdate(req.params.userid, {
      username: req.body.username,
      profilePicture: req.body.profilePicture,
      skills: req.body.skills,
      contactEmail: req.body.contactEmail,
      location: req.body.location,
      bio: req.body.bio
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
