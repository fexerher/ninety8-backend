// const { response } = require("express");
// const Session = require("../models/session");


// const sessionGet = async ( req, res = response ) => {
  
//   try {
//         // Buscar la sesión en la base de datos usando el sessionId de la cookie
//         const session = await Session.findOne({
//             where: { id: req.sessionID }
//           })
//         if (session) {
//           res.json({session})
//         } else {
//           res.status(404).json({ message: 'Session not found' })
//         }
//       } catch (error) {
//         console.error('Error al obtener la sesión:', error)
//         res.status(500).json({ message: 'Internal server error' })
//       }
      
//  }
//  const deleteSession = async (req, res) => {
//   const sessionId = req.params.id;
//   try {
//     // Find the session in the database using the sessionId
//     const session = await Session.findOne({
//       where: { id: sessionId }
//     })

//     if (session) {
//       // Delete the session from the database
//       await session.destroy();
//     }

//     // Send a response with a success message
//     res.json({ message: 'Session deleted' });
//   } catch (error) {
//     console.error('Error al obtener la sesión:', error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }

//  module.exports = {
//     sessionGet,
//     deleteSession,
//  }