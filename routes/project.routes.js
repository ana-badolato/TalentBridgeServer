const express = require("express");
const router = express.Router();

const Project = require("../models/Project.model");
const Event = require("../models/Event.model");
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const User = require("../models/User.model.js");

//* ROUTES GET
// GET /api/project/ -> see all projects, public
router.get("/", async(req, res, next) => {
  try {
    const response = await Project.find().populate("owner", "profilePicture username ") 
    res.status(200).json(response);
  }
  catch (error){
    next(error)
  };
});


// GET /api/project/:projectid -> project detail, public
router.get("/:projectid", async (req, res, next) => {
  try {
    const response = await Project.findById(req.params.projectid)
      .populate('teamMembers', 'username profilePicture') // Reemplaza los IDs de teamMembers con sus documentos completos, solo obteniendo 'username' y 'profilePicture'
      .populate('owner', 'username profilePicture'); // También haz populate de owner para obtener el nombre de usuario e imagen

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});



// GET /api/project/category/:category -> returns an array of projects by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const projects = await Project.find({ category: req.params.category });
    res.status(200).json(projects);
  } catch (error) {
    next(error)
  }
})


//GET /api/project/:projectid/event -> returns an array of events by project
router.get("/:projectid/event", async (req, res, next) =>{
  try {
    const events = await Event.find({relatedProjects: req.params.projectid})
    res.status(200).json(events);
  } catch (error) {
    next(error)
  }
})

// GET /api/project/user/projectsuser -> returns an array of projects by authenticated user
router.get("/user/projectsuser", isAuthenticated, async (req, res, next)=>{
  try {
    const projects = await Project.find({
      $or: [{ owner: req.payload._id }, { teamMembers: { $in: req.payload._id} }]
    }).populate("owner","profilePicture username");

    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
})

// GET /api/project/user/:username/projects -> returns an array of projects by user
router.get("/user/:username/projects", async (req, res, next) => {
  try {

    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({
      $or: [{ owner: user._id }, { teamMembers: { $in: [user._id] } }]
    }).populate("owner", "profilePicture username");

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});



//* ROUTES POST
// POST /api/project/ -> Create new project
router.post("/", isAuthenticated, async(req, res, next) => {
  try {
    const response = await Project.create({
      title: req.body.title,
      description: req.body.description,
      mainObjective: req.body.mainObjective,
      location: req.body.location,
      startDate: req.body.startDate,
      image: req.body.image,
      category: req.body.category,
      owner: req.body.owner,
      teamMembers: req.body.teamMembers
    })
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})



//* ROUTES PUT
// PUT /api/project/:projectid -> Update the details of a project
router.put("/:projectid", isAuthenticated, async (req, res, next) =>{
  try {
    const response = await Project.findByIdAndUpdate(req.params.projectid, {
      title: req.body.title,
      description: req.body.description,
      mainObjective: req.body.mainObjective,
      location: req.body.location,
      startDate: req.body.startDate,
      image: req.body.image,
      category: req.body.category,
      owner: req.body.owner,
      teamMembers: req.body.teamMembers
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

//* ROUTES PATCH

// PATCH /api/project/:projectid/removeteammember/:userid -> Removes teamMember from a project
router.patch("/:projectid/removeteammember/:userid", isAuthenticated, async (req, res, next) =>{
  try {
    const response = await Project.findByIdAndUpdate(req.params.projectid, {
      $pull: { teamMembers: req.params.userid }
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

// PATCH /api/project/:projectid/addteammember/:userid -> Adds a teamMember to a project
router.patch("/:projectid/addteammember/:userid", isAuthenticated, async (req, res, next) =>{
  try {
    const response = await Project.findByIdAndUpdate(req.params.projectid, {
      $push: { teamMembers: req.params.userid }
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

//* ROUTES DELETE

// DELETE  /api/project/:projectid -> delete a project you own
router.delete("/:projectid", isAuthenticated, async(req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.projectid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})


module.exports = router;