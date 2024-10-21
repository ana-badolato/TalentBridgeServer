const jwt = require("jsonwebtoken")

function isAuthenticated(req, res, next) {

  console.log(req.headers)

  try {

    const tokenArr = req.headers.authorization.split(" ")
    const token = tokenArr[1]

    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    
    // console.log(payload)
    req.payload = payload

    next() // si el token existe y es valido, continua con la ruta

  } catch (error) {
    res.status(401).json({message: "Token no valido o no existe"})
  }
}

module.exports = {
  isAuthenticated
}