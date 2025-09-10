import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

function GestionAlmacen() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", cantidad: "", ubicacion: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async (filtro = "") => {
    try {
      const res = await axios.get("http://localhost:3002/api/inventario", {
        params: filtro ? { nombre: filtro } : {},
      });
      setProductos(res.data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const handleSearch = () => {
    fetchProductos(search);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAgregar = () => {
    setFormData({ nombre: "", cantidad: "", ubicacion: "" });
    setEditId(null);
    setShowModal(true);
  };

  const handleEditar = (producto) => {
    setFormData({
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      ubicacion: producto.ubicacion,
    });
    setEditId(producto.id);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await axios.delete(`http://localhost:3002/api/inventario/${id}`);
      fetchProductos();
    }
  };

  const handleGuardar = async () => {
    if (!formData.nombre || !formData.cantidad) return alert("Nombre y cantidad son obligatorios");

    try {
      if (editId) {
        await axios.put(`http://localhost:3002/api/inventario/${editId}`, formData);
      } else {
        await axios.post("http://localhost:3002/api/inventario", formData);
      }
      setShowModal(false);
      fetchProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Almacén</h2>

      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Button onClick={handleSearch}>Buscar</Button>
        <Button className="ms-auto" onClick={handleAgregar}>Agregar Producto</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.cantidad}</td>
              <td>{prod.ubicacion}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEditar(prod)}>Editar</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleEliminar(prod.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Agregar/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>
            {editId ? "Guardar Cambios" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionAlmacen;
