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
      required: [true, "Userame is required."],
    },
    profilePicture: {
      type: String,
      default: "https://www.google.com/imgres?q=profile%20picture%20placeholder%20png&imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F08%2F08%2F09%2F17%2Favatar-1577909_1280.png&imgrefurl=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fplaceholder%2F&docid=Ui67_CMOTmyFsM&tbnid=D8eNFvJHig37mM&vet=12ahUKEwjcpafR0pKJAxVsVqQEHbBIK1YQM3oECCcQAA..i&w=1280&h=1280&hcb=2&ved=2ahUKEwjcpafR0pKJAxVsVqQEHbBIK1YQM3oECCcQAA"
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
