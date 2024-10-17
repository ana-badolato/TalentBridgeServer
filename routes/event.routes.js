const express = require("express");
const router = express.Router();

const Event = require("../models/Event.model");
const Project = require("../models/Project.model");


//*ROUTES

//GET /api/event/
router.get("/", async (req, res, next) => {
  Event.find({})
    try{
      const events = await Event.find()
      res.status(200).json(events);
    } catch(error){
      next(error)
    }

})

//GET /api/event/:eventid
router.get("/:eventid", async (req, res, next) =>{
  try {
    const response = await Event.findById(req.params.eventid)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})


//POST
// POST /api/event/
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
    })
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})


//* ROUTES PUT

//PUT /api/event/:eventid
router.put("/:eventid", async (req, res, next) =>{
  try {
    const response = await Event.findByIdAndUpdate(req.params.eventid,{
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
      relatedProjects: req.body.relatedProjects
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})


//*ROUTES PATCH

//PATCH  /api/event/:eventid/lecturer/:userid
router.patch("/:eventid/lecturer/:userid", async (req, res, next) => {
  try {
    const response = await Event.findByIdAndUpdate( req.params.eventid, { 
        $pull: { lecturer: req.params.userid }
      }, { new: true } 
    );
    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
})


//*ROUTES DELETE

//DELETE /api/event/:eventid
router.delete("/:eventid", async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.eventid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})

module.exports = router;