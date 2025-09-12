import React, { useState } from "react"; // Importa React y el hook useState
import { Form, Button, Col, Row, Container } from "react-bootstrap"; // Importa componentes de Bootstrap
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para la navegación
import "../../css/NuevoObra.css"; // Importa los estilos específicos de NuevoObra
import axios from "axios";

// Componente NuevoObra
const NuevoObra = () => {
  const [obra, setObra] = useState({
    cod: "",
    descripcion: "",
    tipo: "",
    estado: "",
    empresa: "",
    fOferta: "",
    obs: "",
    r: 0,
    pP: 0,
    fP: 0,
    fecha_seg: "",
    horasImputadas: 0,
    horasPrevistas: "",
    totalmenteFacturadas: false,
    fechaFacturacion: "",
  }); // Define el estado inicial de la obra

  const navigate = useNavigate(); // Hook para la navegación

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Extrae propiedades del evento
    setObra((prevObra) => ({
      ...prevObra,
      [name]: type === "checkbox" ? checked : value, // Actualiza el estado de la obra
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3002/obras", obra);
      alert("Obra guardada con éxito");
      navigate("/home/gestion-obras"); // Redirige a la página de gestión de obras después de crear la obra
    } catch (error) {
      if (error) {
        console.error(`Error al guardar la obra - ${error}`);
        alert("Error al guardar la obra");
      }
    }
  };

  // Función para manejar la cancelación de la creación de obra
  const handleCancel = () => {
    navigate("/home/gestion-obras"); // Redirige a la página de gestión de obras al cancelar
  };

  return (
    <Container className="nuevo-obra-container">
      <div className="nuevo-obra">
        <h2>Editor de Obra</h2>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Editor de Obra</legend>
            <Form.Group as={Row} controlId="cod">
              <Form.Label column sm="2">
                Código:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="cod"
                  value={obra.cod}
                  onChange={handleChange}
                  placeholder="código de obra"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="descripcion">
              <Form.Label column sm="2">
                Descripción:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={obra.descripcion}
                  onChange={handleChange}
                  placeholder="descripción de obra"
                />
              </Col>
            </Form.Group>
          </fieldset>

          <fieldset>
            <legend>Información General</legend>
            <Form.Group as={Row} controlId="tipo">
              <Form.Label column sm="2">
                Tipo de Obra:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="tipo"
                  value={obra.tipo}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="INST+PPM">INST+PPM</option>
                  <option value="Mant.">Mant.</option>
                  <option value="SAT">SAT</option>
                  <option value="Otras">Otras</option>
                  <option value="SAT TR">SAT TR</option>
                  <option value="SAT G">SAT G</option>
                  <option value="INST">INST</option>
                  <option value="PPM">PPM</option>
                  <option value="Material">Material</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="estado">
              <Form.Label column sm="2">
                Estado:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="estado"
                  value={obra.estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Solicitada">Solicitada</option>
                  <option value="En Estudio">En Estudio</option>
                  <option value="En Seguimiento">En Seguimiento</option>
                  <option value="Aceptada sin pedido">
                    Aceptada sin pedido
                  </option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Rechazada">Rechazada</option>
                  <option value="En Progreso">En Progreso</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="empresa">
              <Form.Label column sm="2">
                Empresa:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="empresa"
                  value={obra.empresa}
                  onChange={handleChange}
                  placeholder="(ABAC) Ábaco"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fOferta">
              <Form.Label column sm="2">
                Fecha de Oferta:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fOferta"
                  value={obra.fOferta}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="obs">
              <Form.Label column sm="2">
                Observaciones:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="obs"
                  value={obra.obs}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="r">
              <Form.Label column sm="2">
                % Rentabilidad:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="r"
                  value={obra.r}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="pP">
              <Form.Label column sm="2">
                % Pedido de la obra:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="pP"
                  value={obra.pP}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fP">
              <Form.Label column sm="2">
                % Facturado de la obra:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="fP"
                  value={obra.fP}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fecha_seg">
              <Form.Label column sm="2">
                Fecha de Seguimiento:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fecha_seg"
                  value={obra.fecha_seg}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="horasImputadas">
              <Form.Label column sm="2">
                Num. Horas Imputadas:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="horasImputadas"
                  value={obra.horasImputadas}
                  onChange={handleChange}
                  step="0.1"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="horasPrevistas">
              <Form.Label column sm="2">
                Num. Horas Previstas:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="horasPrevistas"
                  value={obra.horasPrevistas}
                  onChange={handleChange}
                  step="0.1"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="totalmenteFacturadas">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  type="checkbox"
                  name="totalmenteFacturadas"
                  checked={obra.totalmenteFacturadas}
                  onChange={handleChange}
                  label="Totalmente Facturada"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fechaFacturacion">
              <Form.Label column sm="2">
                Fecha de Facturación:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fechaFacturacion"
                  value={obra.fechaFacturacion}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
          </fieldset>

          <div className="actions">
            <Button variant="primary" type="submit">
              Guardar obra
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancelar cambios
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default NuevoObra; // Exporta el componente NuevoObra como predeterminado
