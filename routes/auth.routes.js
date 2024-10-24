const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

//* POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { accountEmail, password, username } = req.body;

  // Check if accountEmail or password or name are provided as empty strings
  if (accountEmail === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the accountEmail is of a valid format
  const accountEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!accountEmailRegex.test(accountEmail)) {
    res.status(400).json({ message: "Provide a valid accountEmail address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same accountEmail already exists
  User.findOne({ $or: [{ accountEmail }, { username }] })
    .then((foundUser) => {
      // If the user with the same accountEmail already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If accountEmail is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ accountEmail, password: hashedPassword, username });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { accountEmail, username, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { accountEmail, username, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

//* POST  /auth/login - Verifies accountEmail and password and returns a JWT
router.post("/login", async (req, res, next) => {
  const { accountEmail, password } = req.body;

  // Check if accountEmail or password are provided as empty string
  if (accountEmail === "" || password === "") {
    res.status(400).json({ message: "Provide accountEmail and password." });
    return;
  }

  try {
    const foundUser = await User.findOne({accountEmail: accountEmail})
    console.log(foundUser)

    if(!foundUser){
      res.status(400).json({message: "User not found"})
      return 
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)

    if(!isPasswordCorrect){
      res.status(400).json({message: "Wrong password"})
      return 
    }

    const payload = {
      _id: foundUser._id,
      accountEmail: foundUser.accountEmail
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d"
    })

    res.status(200).json({authToken: authToken})

  } catch (error) {
    next(error)
  }
})

//* GET  /auth/verify  -  Used to verify JWT stored on the client
// router.get("/verify", isAuthenticated, (req, res, next) => {
//   // If JWT token is valid the payload gets decoded by the
//   // isAuthenticated middleware and is made available on `req.payload`
//   console.log(`req.payload`, req.payload);

//   // Send back the token payload object containing the user data
//   res.status(200).json(req.payload);
// });

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    // Obtenemos el _id del payload ya verificado
    const userId = req.payload._id;

    // Buscamos en la base de datos el usuario con su _id para obtener más detalles
    const user = await User.findById(userId).select("_id username profilePicture contactEmail"); // Seleccionamos solo los campos que necesitas

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Enviamos la información del usuario como respuesta
    res.status(200).json(user); // Devolvemos el _id, username y profilePicture
  } catch (error) {
    next(error);
  }
});


module.exports = router;
