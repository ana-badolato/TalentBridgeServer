const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
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
      default: function () {
        return new Date();
      },
    },
    image: {
      type: String,
      default: "https://schemazone.com/wp-content/uploads/2021/03/Project-Manager.jpg"
    },
    category: {
      type: String,
      enum: ["Technology & Innovation", "Sustainability & Environment", "Art & Creativity", "Health & Wellness", "Education & Training", "Community & Social Impact" ],
      required: [true, "Category is required"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;