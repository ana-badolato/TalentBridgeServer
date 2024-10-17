const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  { 
    from: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
     project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
   },
    message: {
      type: String
    }
  })

  const Notification = model("Notification", notificationSchema)

  module.exports = Notification;