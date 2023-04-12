const { response } = require("express");
const { Atributo, Valor} = require("../models/atributo");


const atributosGet = async ( req, res = response ) => {
  try {
    // Retrieve all attributes and their corresponding values
    const atributos = await Atributo.findAll({
      include: {
        model: Valor,
        as: 'valores'
      },
      attributes: ['id','nombre'],
    });

    const transformedData = atributos.map((atributo) => {
      const valores = atributo.valores.map((valor) => valor.valor.toUpperCase()).join(' | ');
      return { nombre: atributo.nombre?.toUpperCase(), valores, id: atributo.id };
    });

    res.json(transformedData);
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al obtener los atributos');
  }

}


const atributoPost = async (req, res = response) => {
  try {
    const atributos = Array.isArray(req.body) ? req.body : [req.body];

    const atributosDb = [];

    for (const atributo of atributos) {
      const atributoDb = await Atributo.create({});
      atributosDb.push(atributoDb);
    }

    res.json(atributosDb);
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al registrar el atributo');
  }
};

const atributosPut = async (req, res = response) => {
  try {
    const atributos = Array.isArray(req.body) ? req.body : [req.body];

    const regex = /^[a-zA-Z]+(\s?[a-zA-Z]+)?(\s*\|\s*[a-zA-Z]+(\s?[a-zA-Z]+)?)*$/;

    // Check that each attribute in the array has a valid 'id', 'nombre' and 'valores' property
    for (const atributo of atributos) {
      if (!atributo.id || !atributo.nombre || !atributo.valores || !regex.test(atributo.valores)) {
        res.json({
          msg: "Los atributos deben tener un 'id', un nombre y valores alfanuméricos separados por un ' | '",
        });
        return;
      }
    }

    const atributosDb = [];

    for (const atributo of atributos) {
      let atributoDb = await Atributo.findByPk(atributo.id);

      if (atributoDb) {
        await atributoDb.update({ nombre: atributo.nombre.toLowerCase(), valores: atributo.valores.toLowerCase() });

        // Remove existing values if there are any
        await atributoDb.setValores([]);

        const valoresArray = atributo.valores.split('|').map((valor) => valor.trim());

        // Create valor instances and associate them with the attribute
        const valoresDb = await Promise.all(
          valoresArray.map((valor) => Valor.create({ valor: valor.toLowerCase() }))
        );

        await atributoDb.setValores(valoresDb);

        const atributoWithValores = await Atributo.findOne({
          where: { id: atributoDb.id },
          include: {
            model: Valor,
            as: 'valores',
            attributes: ['valor'],
            through: { attributes: [] },
          },
        });

        atributosDb.push(atributoWithValores);
      } else {
        res.json({
          msg: `No se encontró un atributo con el ID ${atributo.id}`,
        });
        return;
      }
    }

    const transformedData = atributosDb.map((atributo) => {
      const valores = atributo.valores.map((valor) => valor.valor.toUpperCase()).join(' | ');
      return { nombre: atributo.nombre?.toUpperCase(), valores, id: atributo.id };
    });
    res.json(transformedData);
    
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al actualizar el atributo');
  }
};




const atributoDelete = async (req, res = response) => {
  try {
    const { id } = req.params;

    // Find the attribute to delete
    const atributo = await Atributo.findOne({
      where: { id },
      include: {
        model: Valor,
        as: 'valores',
      },
    });

    if (!atributo) {
      res.status(404).json({ msg: 'Atributo no encontrado' });
      return;
    }

    // Delete all values associated with the attribute
    await Promise.all(atributo.valores.map(async (valor) => {
      await valor.destroy();
    }));

    // Delete the attribute
    await atributo.destroy();

    res.json({ msg: 'Atributo eliminado exitosamente' });
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al eliminar el atributo');
  }
};

 
 module.exports = {
    atributosGet,
    atributoPost,
    atributoDelete,
    atributosPut,
 }