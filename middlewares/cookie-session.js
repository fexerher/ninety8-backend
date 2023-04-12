// const { Op } = require('sequelize');
// const { v4: uuidv4 } = require('uuid');

// const Session = require("../models/session");
// const Carrito = require('../models/carrito');
// const DetalleCarrito = require('../models/detallecarrito');

// const addSessionId = async (req, res, next) => {
  
//   if (!req.sessionID) {
//     req.sessionID = uuidv4();
//   }

//   try {
//     // Check if the session already exists in the database
//     const session = await Session.findOne({
//       where: { id: req.sessionID }
//     });
//     if (session) {
//       // Update the existing session with the new data
//       session.data = JSON.stringify(req.session);
//       session.expires = req.session.cookie.expires;
//       await session.save();
//     } else {
//       // Create a new session in the database
//       req.session.createdAt = new Date();
//       req.session.cookie.expires = new Date(Date.now() + ( 24 * 60 * 60 * 1000 )); // 1hour and 40 mins
//       const sessionData = {
//         id: req.sessionID,
//         expires: req.session.cookie.expires,
//         data: JSON.stringify(req.session) 
//       };
      
//       await Session.create(sessionData);
//     }
//   } catch (error) {
//     console.error('Error al obtener la sesión:', error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
  
//   next();
// };
// const sessionCleanupMiddleware = async (req, res, next) => {
//   try {
//     // Get expired sessions from the database
//     const expiredSessions = await Session.findAll({ where: { expires: { [Op.lte]: new Date() } } });

//     if( expiredSessions.length > 0 ){
//       for (const expiredSession of expiredSessions) {
//         const carrito = await Carrito.findOne({ where: { sessionId: expiredSession.id } });
//         if (carrito) {
//           await DetalleCarrito.destroy({ where: { carritoId: carrito.id } });
//           await carrito.destroy();
//         }
//         await expiredSession.destroy();
//       }
//       // Delete each expired session from the database
//     }
    
//   } catch (error) {
//     console.error(error);
//   }
//   next();
// };

// module.exports = { addSessionId, sessionCleanupMiddleware };
