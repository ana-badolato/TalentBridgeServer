const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  { 
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    mainObjective: {
      type: [String],
      maxlength: 250,
    },
    description: {
      type: [String],
      maxlength: 1000,
    },
    date: {
      type: Date,
      required: [true, "The date of the event is required"]
    },
    time: {
      type: String,
      required: [true, "The time of the event is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please enter a valid time in HH:mm format"],
    },
    address: {//! Revisar cuando implementemos leaflet
      type: String,
      required: [true, "The event's address is required"]
    },
    location: {
      lat: Number,
      lng: Number,
    },
    category: {
      type: String,
      enum: ["Technology & Innovation", "Sustainability & Environment", "Art & Creativity", "Health & Wellness", "Education & Training", "Community & Social Impact" ],
      required: [true, "Category is required"],
    },
    capacity:{
      type: Number,
      default: 0
    },
    capacityCounter:{
      type : Number,
      default: 0
    },
    ticketRequired:{
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: function (){
        return this.ticketRequired
      },
      default: function(){
        // Es tiquet requerido para entrar? Si la respuesta es si (true), deja el campo como undefined para que el usuario en frontend escriba el precio. Si la respuesta es no(false), por defecto el valor del precio sera 0.
        return this.ticketRequired ? undefined : 0
      },
      validate:{
        validator : function (value){
          if (this.ticketRequired){
            return value > 0
          }
          return true
        },
        message: "It is required to know if a ticket is mandatory to acces the event"
      },
    },
    posterImage:{
      type: String,
      default: "https://schemazone.com/wp-content/uploads/2021/03/Project-Manager.jpg"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lecturer: {
      type: [Schema.Types.ObjectId],
      ref: "User", 
      default: function (){
        return this.owner
      },
    },
    atendees:{
      type: [Schema.Types.ObjectId]
    },
    relatedProjects: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
