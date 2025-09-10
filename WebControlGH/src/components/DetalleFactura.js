import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Form, Card, Modal } from "react-bootstrap";

const formPorDefecto = {
  cobrado: "",
  importe: "",
  obs_imp: "",
  importe_base: "",
  iva: "",
};


function DetalleFactura() {
  const [filteredFactura, setFilteredFactura] = useState();
  const { cod } = useParams(); // cod = id
  // Estado para mostrar la modal de edición
  const [showModal, setShowModal] = useState(false);
  // Estado para las actualizaciones en el form de edicion
  const [editForm, setEditForm] = useState(formPorDefecto);
  const navigate = useNavigate();

  // Funcion que llama al endpoint de factura especifica usando axios
  const fetchFactura = async (id) => {
    const endpoint = `http://localhost:3002/facturas/${id}/detalles`;
    try {
      const res = await axios.get(endpoint);
      setFilteredFactura(res.data[0]);
    } catch (err) {
      console.error("Error al obtener la factura", err);
    }
  };

  // Traemos la factura de la BBDD
  useEffect(() => {
    fetchFactura(cod);
  }, []);

  // Handler para mostrar la modal de edición
  const handleEditar = () => {
    setEditForm({
      cobrado: filteredFactura.cobrado,
      importe: filteredFactura.importe,
      obs_imp: filteredFactura.obs_imp,
      importe_base: filteredFactura.importe_base,
      iva: filteredFactura.iva,
    });
    setShowModal(true);
  };

  // Handler para eliminar la factura
  const handleBajaFactura = async () => {
    if (window.confirm("¿Estás seguro de querer eliminar esta factura?")) {
      try {
        await axios.delete(
          `http://localhost:3002/facturas/${filteredFactura.id}`
        );
        alert("Factura eliminada correctamente");
        // Nos dirijimos a la página anterior
        navigate(-1);
      } catch (error) {
        alert("Error al eliminar factura");
        console.error("Error al eliminar la factura", error);
      }
    }
  };

  // Handler para manejar actualizaciones en el form de edicion
  const handleInputChange = (e) => {
    if (e.target.name === "cobrado") {
      setEditForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked ? 1 : 0,
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // Handler para guardar la edicion
  const handleSave = async () => {
    /**
     * Aquí debería haber verificaciones de campos vacíos
     */

    try {
      await axios.put(`http://localhost:3002/facturas/${cod}`, editForm);
      setShowModal(false);
      // Volvemos a mostrar la factura
      fetchFactura(cod);
    } catch (err) {
      console.error("Error al guardar la factura", err);
    }
  };

  if (!filteredFactura) {
    return <div>Factura no encontrada</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Edición de Factura</h2>
      {/* Contenedor de edición */}
      <Card className="p-3 mb-3">
        <Form>
          <Form.Group controlId="fechaFactura">
            <h2>Editor de Factura</h2>
            <Form.Label>
              <strong>Fecha factura:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredFactura.fecha_cabecera}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="codigoFactura" className="mt-2">
            <Form.Label>
              <strong>Código:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.factura_num}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="codigoPedido" className="mt-2">
            <Form.Label>
              <strong>Pedido:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.pedido_pos}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="obra" className="mt-2">
            <Form.Label>
              <strong>Obra:</strong>
            </Form.Label>
            <Form.Control as="textarea" value={filteredFactura.obra} readOnly />
          </Form.Group>

          <Form.Group controlId="importe" className="mt-2">
            <Form.Label>
              <strong>Importe:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.importe}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="cobrado" className="mt-2">
            <Form.Label>
              <strong>Cobrado:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.cobrado === 1 ? "Sí" : "No"}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="conceptoF" className="mt-2">
            <Form.Label>
              <strong>Concepto Factura:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.concepto_f}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="conceptoL" className="mt-2">
            <Form.Label>
              <strong>Concepto Linea:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.concepto_l}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="observaciones" className="mt-2">
            <Form.Label>
              <strong>Observaciones</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredFactura.obs_imp}
              readOnly
            />
          </Form.Group>
        </Form>

        {/* Botones */}
        <div className="d-flex mt-3">
          <Button
            variant="primary"
            className="w-auto px-3 me-2"
            onClick={handleEditar}
          >
            Editar Factura
          </Button>
          <Button
            variant="danger"
            className="w-auto px-3"
            onClick={handleBajaFactura}
          >
            Baja Factura
          </Button>
        </div>
      </Card>

      <Button className="mt-4" onClick={() => navigate(-1)}>
        Volver
      </Button>

      {/* Modal para editar una factura */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closebutton>
          <Modal.Title>{"Editar Factura"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Cobrado</Form.Label>
              <Form.Check
                name="cobrado"
                type="checkbox"
                checked={editForm.cobrado}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Importe</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={editForm.importe}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="obs_imp"
                value={editForm.obs_imp}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Importe Base</Form.Label>
              <Form.Control
                name="importe_base"
                type="number"
                value={editForm.importe_base}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Iva</Form.Label>
              <Form.Control
                name="iva"
                value={editForm.iva}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {"Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DetalleFactura;
