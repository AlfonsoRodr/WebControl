import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NuevaFactura = () => {
  const navigate = useNavigate();

  // Estado para cada campo del formulario
  const [fechaFactura, setFechaFactura] = useState("");
  const [pedido, setPedido] = useState("");
  const [obra, setObra] = useState("");
  const [importe, setImporte] = useState("");
  const [cobrado, setCobrado] = useState(0);
  const [conceptoFactura, setConceptoFactura] = useState("");
  const [conceptoLinea, setConceptoLinea] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [origenFactura, setOrigenFactura] = useState("");
  const [importeBase, setImporteBase] = useState("");
  const [iva, setIva] = useState("");
  const [facturaNum, setFacturaNum] = useState("");

  const handleCancel = () => {
    navigate(-1); // Redirige a la página anterior
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const datosFactura = {
      fecha: fechaFactura,
      origen: origenFactura,
      pedido_pos: pedido,
      obra: obra,
      importe: importe,
      importe_base: importeBase,
      iva: iva,
      cobrado: cobrado,
      concepto_f: conceptoFactura,
      concepto_l: conceptoLinea,
      obs_imp: observaciones,
      factura_num: facturaNum,
    };

    console.log("Datos de la factura:", datosFactura);

    // Realizar la solicitud POST con los datos de la factura
    try {
      const response = await axios.post(
        "http://localhost:3002/facturas",
        datosFactura
      );
      console.log("Factura guardada:", response.data);
      alert("Factura guardada con éxito");
      navigate("/home/gestion-facturas");
    } catch (error) {
      console.error("Error al guardar la factura:", error);
      alert("Error al guardar la factura. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Container className="nueva-factura-container">
      <h2>Nueva Factura</h2>
      <Form onSubmit={handleSave}>
        <Form.Group controlId="facturaNum">
          <Form.Label>Número factura</Form.Label>
          <Form.Control
            type="text"
            placeholder="Número de la factura"
            value={facturaNum}
            onChange={(e) => setFacturaNum(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="fechaFactura">
          <Form.Label>Fecha factura:</Form.Label>
          <Form.Control
            type="date"
            value={fechaFactura}
            onChange={(e) => setFechaFactura(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="origenFactura">
          <Form.Label>Origen:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Origen de la Factura"
            value={origenFactura}
            onChange={(e) => setOrigenFactura(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="pedido">
          <Form.Label>Pedido:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Pedido de la factura(número)"
            value={pedido}
            onChange={(e) => setPedido(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="obra">
          <Form.Label>Obra:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Obra"
            value={obra}
            onChange={(e) => setObra(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="importe">
          <Form.Label>Importe:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="importeBase">
          <Form.Label>Importe Base:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={importeBase}
            onChange={(e) => setImporteBase(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="iva">
          <Form.Label>Iva:</Form.Label>
          <Form.Control
            type="number"
            placeholder="0.0"
            value={iva}
            onChange={(e) => setIva(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="cobrado">
          <Form.Label>Cobrado:</Form.Label>
          <Form.Check
            type="checkbox"
            checked={cobrado}
            onChange={(e) => setCobrado(e.target.checked ? 1 : 0)}
          />
        </Form.Group>

        <Form.Group controlId="conceptoFactura">
          <Form.Label>Concepto Factura:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Concepto de la Factura"
            value={conceptoFactura}
            onChange={(e) => setConceptoFactura(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="conceptoLinea">
          <Form.Label>Concepto Línea:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Concepto de la Línea"
            value={conceptoLinea}
            onChange={(e) => setConceptoLinea(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="observaciones">
          <Form.Label>Observaciones:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Factura
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default NuevaFactura;
