const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const userRouter = require("./user.routes")
router.use("/user", userRouter)

const projectRouter = require("./project.routes")
router.use("/project", projectRouter)

const eventRouter = require("./event.routes")
router.use("/event", eventRouter)

const notificationRouter = require("./notification.routes")
router.use("/notification", notificationRouter)

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

module.exports = router;
