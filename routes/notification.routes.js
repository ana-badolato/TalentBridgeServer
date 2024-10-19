const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification.model");
const Project = require("../models/Project.model");
const Event = require("../models/Event.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");


//* ROUTES GET
//GET /notification/:userid -> Returns an array of notifications from a user
router.get("/:userid", isAuthenticated, async(req, res, next) => {
  try {
    const response = await Notification.find({to: req.params.userid})
    res.status(200).json(response);
  }
  catch (error){
    next(error)
  };
});


//* ROUTES POST
//POST /notification/ -> Creates a new notification
router.post("/", isAuthenticated, async(req, res, next) => {
  try {
    const response = await Notification.create({
      from: req.body.from,
      to: req.body.to,
      project: req.body.project,
      event: req.body.event,
      message: req.body.message
    })
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})


//* ROUTES DELETE
//DELETE /notification/:notificationid -> Deletes a notification
router.delete("/:notificationid", isAuthenticated, async(req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.notificationid)
    res.sendStatus(202)
  }catch(error){
    next(error)
  }
})



module.exports = router