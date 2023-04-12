
const { response } = require('express')
const Producto = require('../models/producto')
const cloudinary = require('cloudinary').v2;
const slugify = require('slugify');
// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const productosGet = async (req, res = response) => {

    const { limite = 5, page = 1, categoria, vendidos, nuevos, ordenar } = req.query;
  
    // Define the Sequelize options for the query
    const options = {
      limit: isNaN(limite) ? 5 : Number(limite),
      offset: isNaN(page) ? 0 : (page - 1) * limite,
      where: {},
    };

    // Add category filter to options
    // if (categoria) {
    //     options.where.categoria = categoria;
    // }
    
  
  
    // Add filter for new arrivals
    if (nuevos) {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        options.where.createdAt = { [Op.gte]: oneWeekAgo };
        options.order = [['createdAt', 'DESC']];
    }
  
    // Add sorting options
    if (ordenar) {
        const lookup = {
          nombre_asc: ['nombre', 'ASC'],
          nombre_desc: ['nombre', 'DESC'],
          precio_asc: ['precio', 'ASC'],
          precio_desc: ['precio', 'DESC'],
          descuento_asc: ['descuento', 'ASC'],
          descuento_desc: ['descuento', 'DESC'],
        };
      
        const order = lookup[ordenar];
      
        if (order) {
          options.order = [order];
        }
    }
      
  
    // Find products with the specified options
    const { count, rows: productos } = await Producto.findAndCountAll(options);
  
    // Calculate total number of pages based on count of products and number of items per page
    const totalPages = Math.ceil(count / options.limit);
  
    // Send the response with the product data and total number of pages
    res.json({ productos, totalPages });
  };
  

const getProductoById = async (req, res) => {
    const {  slugifiedName } = req.params;
    try {
        // Look up the product by slug
        const producto = await Producto.findOne({
        where: { slug: slugifiedName },
        });

        if (!producto) {
        return res.json({ msg: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

const productosPut = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      // Verificar si el producto existe
      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ message: 'El producto no existe' });
      }
  
      // Verificar si se subió una nueva imagen
      if (req.files && req.files.image) {
        const { image } = req.files;
  
        // Cargar la nueva imagen en Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath);
  
        // Eliminar la imagen anterior de Cloudinary
        await cloudinary.uploader.destroy(producto.public_id);
  
        // Actualizar los datos del producto en la base de datos
        await Producto.update(
          {
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            descuento: req.body.descuento,
            imagen: uploadedImage.secure_url,
          },
          {
            where: { id },
          }
        );
  
        res.json({ message: 'El producto fue actualizado correctamente' });
      } else {
        // No se subió una nueva imagen, actualizar solo los datos del producto en la base de datos
        await Producto.update(req.body, {
          where: { id },
        });
  
        res.json({ message: 'El producto fue actualizado correctamente' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un problema al actualizar el producto' });
    }
  };

const productosPost = async (req, res = response) => {
    
    const { nombre, precio, descripcion, descuento } = req.body;
    try {
      console.log(req.files)
      // Get the product data from the request body
      const slug = slugify(nombre, { lower: true });
      // Check if an image was provided
      if ( !req.files || !req.files.image ) {
        return res.status(400).json({ message: 'Image is required' });
      }
  
      // Check the size of the uploaded image
      const imageSize = req.files.image.size;
      if (imageSize > 500000) {
        return res.status(400).json({ message: 'Image size too large' });
      }
  
      // Upload the image to Cloudinary and get the URL
      const cloudinaryResult = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      const image_url = cloudinaryResult.secure_url;
      const public_id = cloudinaryResult.public_id;

      // Check if a product with the same name already exists
      const existingProduct = await Producto.findOne({ where: { nombre } });
      if (existingProduct) {
      // Delete the newly uploaded image from Cloudinary if a product with the same name already exists
        await cloudinary.uploader.destroy(public_id);
        return res.status(400).json({ message: 'Product with the same name already exists' });
    }
  
      // Create a new product with the provided data and image URL
      const newProduct = { nombre, precio, descripcion, descuento, image: image_url, slug, public_id};
  
      // Save the new product to the database using Sequelize
      const product = await Producto.create(newProduct);
  
      // Send a success response with the new product data
      res.status(201).json({ message: 'Product created', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating product' });
    }
  };

const productosDelete = async (req, res) => {
    const { id } = req.params;
    try {
      // Find the product to delete by id
      const productToDelete = await Producto.findByPk(id);
      if (!productToDelete) {
        return res.status(404).json({ message: 'Product not found' });
      }
      // Delete the product's image from Cloudinary if it exists
      if (productToDelete.imagen) {
        const publicId = productToDelete.imagen.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Delete the product from the database
      await productToDelete.destroy();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    getProductoById,
    productosGet,
    productosPut,
    productosPost,
    productosDelete,
}