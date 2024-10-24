const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    accountEmail: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Userame is required."],
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/drqiultmd/image/upload/v1729707730/wt5jxiswqfcwebb89dwx.png"
    },
    skills: {
      type: [String],
    },
    contactEmail: {
      type: String,
      default: function (){
        return this.accountEmail
      },
    },
    location: {
       type: String,
    },
    bio: {
      type: String,
      maxlength: 250,

    }
//! Añadir chats y messages. 
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
