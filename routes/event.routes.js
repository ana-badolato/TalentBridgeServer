const express = require("express");
const router = express.Router();

const Event = require("../models/Event.model");
const Project = require("../models/Project.model");
const User = require("../models/User.model.js");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//*ROUTES

//GET /api/event/ -> Returns an array of all events
router.get("/", async (req, res, next) => {
  Event.find({})
    try{
      const events = await Event.find().populate("owner", "profilePicture username ") 
      res.status(200).json(events);
    } catch(error){
      next(error)
    }

})

// GET /api/event/:eventid -> Returns the details of an event
router.get("/:eventid", async (req, res, next) => {
  try {
    const response = await Event.findById(req.params.eventid)
      .populate({
        path: 'relatedProjects', // Popula el campo relatedProjects
        populate: {
          path: 'owner', // Dentro de relatedProjects, popula el campo owner
          select: 'username profilePicture bio' // Solo trae los campos necesarios
        }
      })
      .populate('owner', 'profilePicture username bio') // Popula el owner directamente del evento
      .populate({
        path: 'lecturer', // Popula el campo lecturer
        select: 'username profilePicture bio' // Solo trae los campos necesarios
      });

    console.log("Datos del evento con populate:", response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});




// GET /api/event/user/eventsuser -> Returns an array of events by authenticated user
router.get("/user/eventsuser", isAuthenticated, async (req, res, next)=>{
  try {
    const event = await Event.find({
      $or: [{ owner: req.payload._id }, { lecturer: { $in: req.payload._id } }, { atendees: {$in: req.payload._id } } ]
    }).populate("owner", "profilePicture username")
    console.log(event)
    res.status(200).json(event)
  } catch (error) {
    next(error)
  }
})

// GET /api/event/user/:username/events -> Returns an array of events by public user
router.get("/user/:username/events", async (req, res, next)=>{
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const event = await Event.find({
      $or: [{ owner: user._id }, { lecturer: { $in: user._id } }, { atendees: {$in: user._id } } ]
    }).populate("owner", "profilePicture username")

    console.log(event)
    res.status(200).json(event)
  } catch (error) {
    next(error)
  }
})

//POST
// POST /api/event/ -> Creates a new event
router.post("/", isAuthenticated, async(req,res,next)=>{
  try {
    const response = await Event.create ({
      name: req.body.name,
      mainObjective: req.body.mainObjective,
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
      owner:req.payload._id,
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

//PUT /api/event/:eventid -> Updates the details of an event
router.put("/:eventid", isAuthenticated, async (req, res, next) =>{
  try {
    const response = await Event.findByIdAndUpdate(req.params.eventid,{
      name: req.body.name,
      mainObjective: req.body.mainObjective,
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
      lecturer: req.body.lecturer,
      atendees: req.body.atendees,
      relatedProjects: req.body.relatedProjects
    }, {new: true})
    res.status(202).json(response)
  } catch (error) {
    next(error)
  }
})

// PUT /event/:eventId/join -> Permite que un usuario se una a un evento
router.put("/:eventId/join", isAuthenticated, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { atendeeId } = req.body;

    // Buscar el evento
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Añadir al asistente al evento
    if (!event.atendees.includes(atendeeId)) {  // Reemplazamos atendees por el nombre correcto
      event.atendees.push(atendeeId); // Agregar el usuario a la lista de asistentes
      await event.save();
      return res.status(200).json({ message: "Te has unido al evento", event });
    } else {
      return res.status(400).json({ message: "Ya eres asistente del evento" });
    }
  } catch (error) {
    next(error);
  }
});

//*ROUTES PATCH
//PATCH  /api/event/:eventid/removelecturer/:userid -> Removes a lecturer from an event
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

// PATCH /api/event/:eventid/addlecturer/:userid -> Adds a lecturer to an event
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

// PATCH /api/event/:eventid/addatendees/:userid -> Adds an atendee to an event
router.patch("/:eventid/addatendees/:userid", isAuthenticated, async (req, res, next)=>{
  console.log(req.params.userid, req.params.eventid)
  try {
    const response = await Event.findByIdAndUpdate( req.params.eventid, { 
      $push: { atendees: req.params.userid }
    }, { new: true } 
  );
  
  res.status(202).json(response);
} catch (error) {
    next(error)
  }
})

//PATCH /api/event/:eventid/incrementcapacitycounter -> +1 to capacity counter
router.patch("/:eventid/incrementcapacitycounter", async (req, res, next)=>{
  try {
    const response = await Event.findByIdAndUpdate(req.params.eventid,
      { $inc: {capacityCounter: 1} }, 
    {new: true})
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})


//*ROUTES DELETE
//DELETE /api/event/:eventid -> Deletes an event
router.delete("/:eventid", isAuthenticated, async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.eventid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})

module.exports = router;