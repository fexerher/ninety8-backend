const Carrito = require("../models/carrito");
const DetalleCarrito = require("../models/detallecarrito");
const Producto = require("../models/producto");

// Verifica si el producto ya está en el carrito y devuelve el detalle correspondiente
async function obtenerDetalleCarrito(carritoId, productoId) {
  const detalle = await DetalleCarrito.findOne({ where: { carritoId, ProductoId: productoId } });
  return detalle;
}

// Crea un nuevo carrito y lo devuelve
async function crearCarrito( sessionId ) {
  const carrito = await Carrito.create({
    usuarioId: null,
    subtotal: 0,
    total: 0,
    sessionId,
  });
  return carrito;
}

// Agrega un nuevo registro al detalle del carrito o actualiza la cantidad si ya existe
async function agregarDetalleCarrito(carritoId, productoId, cantidad) {
  const producto = await Producto.findByPk(productoId);
  const precio = producto.precio;
  let detalle = await obtenerDetalleCarrito(carritoId, productoId);

  if (detalle) {
    detalle.cantidad = cantidad;
    detalle.subtotal = detalle.cantidad * precio;
    await detalle.save();
  } else {
    detalle = await DetalleCarrito.create({
      carritoId,
      ProductoId: productoId,
      cantidad,
      precio,
      subtotal: cantidad * precio,
    }, );
  }

  return detalle;
}

// Obtiene el subtotal y total del carrito y los actualiza
async function actualizarTotalesCarrito(carritoId) {
  const subtotal = await DetalleCarrito.sum('subtotal', { where: { carritoId } });
  const carrito = await Carrito.findByPk(carritoId);
  carrito.subtotal = subtotal;
  carrito.total = subtotal;
   await carrito.save();
  return carrito
}
async function vaciarCarrito ( id )  {
  try {
    await DetalleCarrito.destroy({ where: { carritoId: id} });

    await actualizarTotalesCarrito( carrito.id )
  } catch (error) {
    throw new Error( error )
  }
}  

const validateSession = (req) => {
  const sessionId = req.sessionID;
  if (!sessionId) {
    throw new Error('No hay una sesión');
  }
  return sessionId;
};

const findCarrito = async (sessionId) => {
  const carrito = await Carrito.findOne({ where: { sessionId } });
  if (!carrito) {
    throw new Error('No existe un carrito para esta sesión');
  }
  return carrito;
};

const findProductos = async (detalles) => {
  const productosIds = detalles.map((detalle) => detalle.id);
  const productos = await Producto.findAll({ where: { id: productosIds } });
  if (productos.length !== detalles.length) {
    throw new Error('Alguno de los productos no existe');
  }
  return productos;
};
const updateDetallesCarrito = async (detalles, productos, carrito, t) => {
  for (let i = 0; i < detalles.length; i++) {
    const detalle = detalles[i];
    const producto = productos.find((p) => p.id === detalle.id);

    if (detalle.cantidad <= 0) {
      await DetalleCarrito.destroy({ where: { carritoId: carrito.id, productoId: detalle.id }, transaction: t });
    } else {
      const subtotal = parseFloat((detalle.cantidad * producto.precio).toFixed(2));
      await DetalleCarrito.update(
        { cantidad: detalle.cantidad, subtotal },
        { where: { carritoId: carrito.id, productoId: detalle.id }, transaction: t }
      );
    }
  }
};
const updateCarrito = async (carrito, t) => {
  const updatedCarrito = await Carrito.findByPk(carrito.id, { include: [DetalleCarrito], transaction: t });
  const subtotal = updatedCarrito.Detalles.reduce((acc, curr) => acc + curr.subtotal, 0);
  const total = updatedCarrito.Detalles.reduce((acc, curr) => acc + curr.subtotal, 0);
  await Carrito.update({ subtotal, total }, { where: { id: carrito.id }, transaction: t });
};

const buildDetalleCarrito = (carrito) => {
  return {
    detalles: carrito.Detalles.map((detalle) => {
      const { id, cantidad, subtotal, precio, Producto } = detalle;
      const { id: productoId, nombre, image, descripcion } = Producto;
      return { detalleId: id, cantidad, subtotal, precio, id: productoId, nombre, image, descripcion };
    }),
    subtotal: carrito.subtotal,
    total: carrito.total,
  };
};

const deleteDetalle = async (detalleId) => {
  const detalle = await DetalleCarrito.findOne({ where: { id: detalleId } });

  if (!detalle) {
    return { msg: 'No existe ningún producto con ese id' };
  }

  await detalle.destroy();

  const detalles = await DetalleCarrito.findAll({ where: { carritoId: detalle.carritoId } });

  if (detalles.length === 0) {
    const carrito = await Carrito.findOne({ where: { id: detalle.carritoId } })
    await carrito.destroy();
  }

  return { msg: 'deleted', producto: detalle };
};

module.exports = {
  actualizarTotalesCarrito,
  agregarDetalleCarrito,
  buildDetalleCarrito,
  crearCarrito,
  deleteDetalle,
  findCarrito,
  findProductos,
  obtenerDetalleCarrito,
  updateCarrito,
  updateDetallesCarrito,
  vaciarCarrito,
  validateSession,
}