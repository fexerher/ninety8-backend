const { response } = require('express');
const { crearCarrito, agregarDetalleCarrito, actualizarTotalesCarrito, obtenerDetalleCarrito, validateSession, findCarrito, findProductos, updateCarrito, updateDetallesCarrito, buildDetalleCarrito, deleteDetalle } = require('../helpers/cartFunctions');

const DetalleCarrito = require('../models/detallecarrito');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const { db } = require('../db/connection');



const carritosGet = async (req, res = response) => {

  const carrito = await Carrito.findAll({
    where: { sessionId : req.sessionID },
    include: [ { model: DetalleCarrito, include: [{ model: Producto,},],}, ],
  })

    res.json(carrito)
};
const carritoDelete = async (req, res = response) => {
  const { id } = req.params;

  validateSession(req)

 try {
  const resultado = await deleteDetalle(id);
  res.json(resultado);
 } catch (error) {
  console.log(error);
  res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
 }

};


const carritoGet = async (req, res = response) => {

  const { id } = req.params;
  let sessionId = req.session.sessionId
  try {
      const carrito = await Carrito.findOne({ 
          where: { id, sessionId },
          include: [{ model: DetalleCarrito, include: Producto }]
        });
      if( !carrito ){
        return res.status(404).json({ msg: "No existe ningun carrito con ese id" })
      }  
        res.json(carrito);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

const carritoPost = async (req, res = response) => {
    const { productoId, cantidad } = req.body;
    const sessionId = req.sessionID
    
    try {
      if (!productoId || !cantidad) {
        res.status(400).json({ msg: 'Producto o cantidad inválidos' });
        return;
      }

      let carrito = await Carrito.findOne({ where: { sessionId } });
      
      if (!carrito) {
          carrito = await crearCarrito( sessionId );
      } 
      
      const detalle = await agregarDetalleCarrito( carrito.id , productoId, cantidad )
      await actualizarTotalesCarrito( carrito.id )
      
      const producto = await Producto.findByPk( productoId )
  
      const detalleCarrito = {
        detail: {
          id: detalle.id,
          subtotal: detalle.subtotal,
          cantidad: detalle.cantidad,
          carritoId: detalle.carritoId,
          ProductoId: detalle.ProductoId,
          precio: detalle.precio,
          image: detalle.image,
        },
        carrito: {
          id: carrito.id,
          subtotal: carrito.subtotal,
          total: carrito.total,
        },
        producto,
      };
  
      res.json( detalleCarrito )
      
    } catch (error) {
      res.json('Error al buscar detalle')
    }


  };
  
  
  const carritoUpdate = async (req, res = response) => {
   const { detalles } = req.body;
    try{

      const sessionId = validateSession(req);
      const carrito = await findCarrito(sessionId);
      const productos = await findProductos(detalles);

      await db.transaction(async (t) => {
        await updateDetallesCarrito(detalles, productos, carrito, t);
        await updateCarrito(carrito, t);
      });
      const carritoActualizado = await Carrito.findByPk(carrito.id, {
        include: [{ model: DetalleCarrito, include: { model: Producto } }],
      });

      const detalleCarrito = buildDetalleCarrito(carritoActualizado);

      res.json(detalleCarrito);

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error al actualizar el carrito' });
    }
  };
  
  
  
  
  const deleteCarritoDetalle = async( req, res) => {
    const { id } = req.params;
    try {

      if (!id) {
        return res.status(400).json({ msg: 'No se proporcionó el id del carrito' });
      }

      await Carrito.destroy({
        where: { id },
        cascade: true, // eliminar los detalles del carrito junto con el carrito principal
      });

      res.json({ msg: 'Carrito eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ msg: 'Ocurrió un error al eliminar el carrito' });
    }
  }
  
  

module.exports = {
    carritoGet,
    carritoPost,
    carritosGet,
    carritoDelete,
    carritoUpdate,
    deleteCarritoDetalle
}