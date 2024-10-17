const express = require("express");
const router = express.Router();

const Project = require("../models/Project.model");
const Event = require("../models/Event.model");

//* ROUTES GET
// GET /api/project/
router.get("/", async(req, res, next) => {
  try {
    const response = await Project.find()
    res.status(200).json(response);
  }
  catch (error){
    next(error)
  };
});


// GET /api/project/:projectid
router.get("/:projectid", async(req, res, next) => {
  try {
    const response = await Project.findById(req.params.projectid)
    res.status(200).json(response);
  }
  catch (error){
    next(error)
  };
});


// GET /api/project/category/:category
router.get("/category/:category", async (req, res, next) => {
  try {
    const projects = await Project.find({ category: req.params.category });
    res.status(200).json(projects);
  } catch (error) {
    next(error)
  }
})


//GET /api/project/:projectid/event
router.get("/:projectid/event", async (req, res, next) =>{
  try {
    const events = await Event.find({relatedProjects: req.params.projectid})
    res.status(200).json(events);
  } catch (error) {
    next(error)
  }
})


//* ROUTES POST
// POST /api/project/
router.post("/", async(req, res, next) => {
  try {
    const response = await Project.create({
      title: req.body.title,
      description: req.body.description,
      mainObjective: req.body.mainObjective,
      location: req.body.mainObjective,
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
// PUT /api/project/:projectid
router.put("/:projectid", async (req, res, next) =>{
  try {
    const response = await Project.findByIdAndUpdate(req.params.projectid, {
      title: req.body.title,
      description: req.body.description,
      mainObjective: req.body.mainObjective,
      location: req.body.mainObjective,
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

// PATCH /api/project/:projectid/teammember/:userid
module.exports = router;
router.patch("/:projectid/teammember/:userid", async (req, res, next) =>{
  try {
    const response = await Project.findByIdAndUpdate(req.params.projectid, {
      $pull: { teamMembers: req.params.userid }
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})


//* ROUTES DELETE

// DELETE  /api/project/:projectid
router.delete("/:projectid", async(req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.projectid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})


module.exports = router;