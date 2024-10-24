const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    mainObjective: {
      type: String,
      maxlength: 250,
      required: [true, "Main Objective is required"]
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    image: {
      type: String,
      default: "https://res.cloudinary.com/drqiultmd/image/upload/v1729707730/vzupen0uk9ctuhtatn2q.png"
    },
    category: {
      type: String,
      enum: ["Technology & Innovation", "Sustainability & Environment", "Art & Creativity", "Health & Wellness", "Education & Training", "Community & Social Impact" ],
      required: [true, "Category is required"]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: function (){
        return this.owner
      },
    },
    teamMembers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Project = model("Project", projectSchema);

module.exports = Project;