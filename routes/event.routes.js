const express = require("express");
const router = express.Router();

const Event = require("../models/Event.model");
const Project = require("../models/Project.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//*ROUTES

//GET /api/event/ -> all event, public
router.get("/", async (req, res, next) => {
  Event.find({})
    try{
      const events = await Event.find()
      res.status(200).json(events);
    } catch(error){
      next(error)
    }

})

//GET /api/event/:eventid -> Event details, public
router.get("/:eventid", async (req, res, next) =>{
  try {
    const response = await Event.findById(req.params.eventid)
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})


//POST
// POST /api/event/ -> new event, private
router.post("/", isAuthenticated, async(req,res,next)=>{
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
router.put("/:eventid", isAuthenticated, async (req, res, next) =>{
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

//PATCH  /api/event/:eventid/lecturer/:userid -> remove an user from an event
router.patch("/:eventid/removelecturer/:userid", isAuthenticated, async (req, res, next) => {
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

// PATCH /api/event/:eventid/lecturer/:userid -> add a user to lecturer array
router.patch("/:eventid/addlecturer/:userid", isAuthenticated, async (req, res, next)=>{
  console.log(req.params.userid, req.params.eventid)
  try {
    const response = await Event.findByIdAndUpdate( req.params.eventid, { 
      $push: { lecturer: req.params.userid }
    }, { new: true } 
  );
  
  res.status(202).json(response);
} catch (error) {
    next(error)
  }
})


//*ROUTES DELETE

//DELETE /api/event/:eventid
router.delete("/:eventid", isAuthenticated, async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.eventid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})

module.exports = router;