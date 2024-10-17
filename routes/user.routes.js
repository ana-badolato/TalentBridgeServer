const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const Project = require ("../models/Project.model")
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get("/", async (req, res, next)=>{
  User.find({})
  try {
    const response = await User.find()
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

router.get("/:userid", isAuthenticated, async (req, res, next)=>{
  try {
    const response = await User.findById(req.params.userid);
    res.status(200).json(response);
  } catch (error) {
    next(error)
  }
})

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


module.exports = router;
