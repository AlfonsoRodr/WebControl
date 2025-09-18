const almacenModel = require("../models/almacenModel.js");

exports.getAllProductos = (req, res) => {
  almacenModel.getAllProductos((err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al obtener los productos - ${err}` });
    }
    res.json(result);
  });
};

exports.getProductoById = (req, res) => {
  const { id } = req.params;
  almacenModel.getProductoById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: `Error al obtener el producto con id ${id} - ${err}`,
      });
    }
    res.json(result[0]);
  });
};

exports.createProducto = (req, res) => {
  almacenModel.createProducto(req.body, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al crear el producto - ${err}` });
    }
    res.status(201).json({ message: "Producto creado con éxito" });
  });
};

exports.updateProducto = (req, res) => {
  const { id } = req.params;
  almacenModel.updateProducto(id, req.body, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al actualizar el producto - ${err}` });
    }
    res.json({ message: "Producto actualizado correctamente" });
  });
};

exports.deletePedido = (req, res) => {
  const { id } = req.params;
  almacenModel.deleteProducto(id, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: `Error al eliminar el producto - ${err}` });
    }
    res.json({ message: "Producto borrado correctamente" });
  });
};
