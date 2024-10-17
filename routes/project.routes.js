const express = require("express");
const router = express.Router();

const Project = require("../models/Project.model")

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

module.exports = router;