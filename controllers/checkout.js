const { response } = require("express");

const mercadopago = require('mercadopago');
const Carrito = require("../models/carrito");
const DetalleCarrito = require("../models/detallecarrito");
const Producto = require("../models/producto");


// Configurar credenciales de MercadoPago
mercadopago.configure({
   access_token: process.env.MP_ACCESS_TOKEN,
   client_id: process.env.MP_CLIENT_ID,
   client_secret: process.env.MP_CLIENT_SECRET,
 });

 // Función para crear la preferencia de pago en MercadoPago
 const createPreference = async (carrito, productos) => {
   // Crear los ítems de la preferencia
   const items = productos.map((producto) => ({
     title: producto.nombre,
     description: producto.descripcion,
     quantity: producto.cantidad,
     currency_id: 'ARS',
     unit_price: parseFloat(producto.precio) ,
   }));
   // Crear el objeto de preferencia
   const preference = {
      items,
      external_reference: carrito.id.toString(),
      payer: {
         name: 'John',
         surname: 'Doe',
         email: 'johndoe@example.com',
      },
      notification_url: `${process.env.MP_BASE_URL}/webhooks/notifications`,
      back_urls: {
        success: `${process.env.MP_BASE_URL}/checkout/success`,
        failure: `${process.env.MP_BASE_URL}/checkout/failure`,
        pending: `${process.env.MP_BASE_URL}/checkout/pending`,
      },
   };
   
   // Crear la preferencia en MercadoPago
   const response = await mercadopago.preferences.create(preference);
   
   // Retornar el init_point de la preferencia
   return response.body.init_point;
};
 
 

const checkoutPost = async ( req, res = response ) => {
   
   try {
      // Obtener el carrito y los productos del cuerpo de la solicitud
      const { carritoId, productos } = req.body;

      
      // Buscar el carrito en la base de datos
      const carrito = await Carrito.findByPk(carritoId, { include: [{model: DetalleCarrito, include: {model: Producto}}]});
     
      
      // Crear la preferencia de pago en MercadoPago
      const initPoint = await createPreference(carrito, productos);

      const idPref = initPoint.split('=')[1];

      // Redireccionar al usuario al init_point de la preferencia
      res.json(idPref);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar el pago.');
    }

 }

 module.exports = {
    checkoutPost
 }