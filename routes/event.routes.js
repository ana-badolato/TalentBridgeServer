const express = require("express");
const router = express.Router();

const Event = require("../models/Event.model")

router.post("/", async(req,res,next)=>{
  try {
    const response = await Event.create ({
      name: req.body.name,
      description: req.body.description,
      date:req.body.date,
      time: req.body.time,
      address: req.body.address,
      location: req.body.location,
      category: req.body.category,
      capacity: req.body.capacity,
      capacityCounter: req.body.capacityCounter,
      ticketRequired: req.body.ticketRequired,
      price: req.body.price,
      posterImage: req.body.posterImage,
      owner:req.body.owner,
      lecturer: req.body.lecturer,
      atendees: req.body.atendees,
      relatedProjects: req.body.relatedProjects,
      isPublic: req.body.isPublic
    })
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})


module.exports = router;