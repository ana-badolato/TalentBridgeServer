const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification.model");
const Project = require("../models/Project.model");
const Event = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//* ROUTES GET
// GET /notification/:userid -> Returns an array of notifications from a user
router.get("/:userid", isAuthenticated, async (req, res, next) => {
  try {
    // Populamos para obtener información sobre el remitente, proyecto y evento
    const response = await Notification.find({ to: req.params.userid })
      .populate("from", "username") // Populamos el campo "from" con el username
      .populate("project", "title") // Populamos el campo "project" con el título del proyecto
      .populate("event", "name"); // Populamos el campo "event" con el nombre del evento

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//* POST /notification/ -> Creates a new notification
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Notification.create({
      from: req.payload._id,
      to: req.body.to,
      project: req.body.project,
      event: req.body.event,
      message: req.body.message,
      type: req.body.project ? "action" : "info", // "action" para proyectos y "info" para eventos
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});


//* ROUTES PUT
router.put("/:notificationId/accept", isAuthenticated, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId).populate("project");

    // Verificar que la notificación sea de tipo proyecto
    if (!notification || !notification.project) {
      return res.status(400).json({ message: "Acción solo disponible para solicitudes de proyectos." });
    }

    // Agregar al solicitante al equipo del proyecto
    const project = await Project.findById(notification.project._id);
    project.teamMembers.push(notification.from); // Agregar al usuario solicitante al equipo
    await project.save();

    // Borrar la notificación después de aceptar
    await Notification.findByIdAndDelete(req.params.notificationId);

    res.status(200).json({ message: "Solicitud aceptada y usuario agregado al proyecto" });
  } catch (error) {
    next(error);
  }
});

// PUT /notifications/:notificationId/reject -> Reject a project request
router.put("/:notificationId/reject", isAuthenticated, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);

    // Verificar que la notificación sea de tipo proyecto
    if (!notification || !notification.project) {
      return res.status(400).json({ message: "Acción solo disponible para solicitudes de proyectos." });
    }

    // Simplemente eliminamos la notificación al rechazarla
    await Notification.findByIdAndDelete(req.params.notificationId);
    res.status(200).json({ message: "Solicitud rechazada" });
  } catch (error) {
    next(error);
  }
});

//* ROUTES DELETE
// DELETE /notification/:notificationId -> Deletes a notification
router.delete("/:notificationid", isAuthenticated, async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.notificationid);
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
