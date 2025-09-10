import React, { useState } from 'react'; // Importa React y el hook useState
import { Form, Button, Col, Row, Container } from 'react-bootstrap'; // Importa componentes de Bootstrap
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación
import './NuevoObra.css'; // Importa los estilos específicos de NuevoObra

// Componente NuevoObra
const NuevoObra = () => {
  const [obra, setObra] = useState({
    codigo: '',
    descripcion: '',
    enSeguimiento: false,
    dependeDe: '',
    obrasSubordinadas: '',
    tipoObra: '',
    facturable: false,
    estado: '',
    fechaAlta: '',
    usuarioAlta: '',
    fechaPrevistaFin: '',
    numHorasPrevistas: 0,
    gastoPrevisto: 0,
    importe: 0,
    viabilidad: 100,
    empresa: '',
    contacto: '',
    complejo: '',
    observaciones: '',
    observacionesInternas: ''
  });// Define el estado inicial de la obra

  const navigate = useNavigate(); // Hook para la navegación

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Extrae propiedades del evento
    setObra((prevObra) => ({
      ...prevObra,
      [name]: type === 'checkbox' ? checked : value, // Actualiza el estado de la obra
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    /*try {
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté disponible
      const response = await fetch('http://yourserver.com/api/obras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token de autorización si es necesario
        },
        body: JSON.stringify(obra),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Obra creada:', data);
        navigate('/obras'); // Redirige a la lista de obras u otra página después de crear la obra
      } else {
        const errorData = await response.json();
        console.error('Error al crear la obra:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }*/
    navigate('/home/gestion-obras'); // Redirige a la página de gestión de obras después de crear la obra
  };

  // Función para manejar la cancelación de la creación de obra
  const handleCancel = () => {
    navigate('/home/gestion-obras'); // Redirige a la página de gestión de obras al cancelar
  };

  return (
    <Container className="nuevo-obra-container">
      <div className="nuevo-obra">
        <h2>Editor de Obra</h2>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Editor de Obra</legend>
            <Form.Group as={Row} controlId="codigo">
              <Form.Label column sm="2">Código:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="codigo" 
                  value={obra.codigo} 
                  onChange={handleChange} 
                  placeholder="código de obra" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="descripcion">
              <Form.Label column sm="2">Descripción:</Form.Label>
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

            <Form.Group as={Row} controlId="enSeguimiento">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check 
                  type="checkbox" 
                  name="enSeguimiento" 
                  checked={obra.enSeguimiento} 
                  onChange={handleChange} 
                  label="En Seguimiento" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="dependeDe">
              <Form.Label column sm="2">Depende de la Obra:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="dependeDe" 
                  value={obra.dependeDe} 
                  onChange={handleChange} 
                  placeholder="escriba para buscar" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="obrasSubordinadas">
              <Form.Label column sm="2">Obras Subordinadas:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="obrasSubordinadas" 
                  value={obra.obrasSubordinadas} 
                  onChange={handleChange} 
                  placeholder="escriba para buscar" 
                />
              </Col>
            </Form.Group>
          </fieldset>

          <fieldset>
            <legend>Información General</legend>
            <Form.Group as={Row} controlId="tipoObra">
              <Form.Label column sm="2">Tipo de Obra:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  as="select" 
                  name="tipoObra" 
                  value={obra.tipoObra} 
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="INST+PPM">INST+PPM</option>
                  {/* Agrega más opciones según sea necesario */}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="facturable">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check 
                  type="checkbox" 
                  name="facturable" 
                  checked={obra.facturable} 
                  onChange={handleChange} 
                  label="Facturable" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="estado">
              <Form.Label column sm="2">Estado:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  as="select" 
                  name="estado" 
                  value={obra.estado} 
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Pendiente de envío de Oferta">Pendiente de envío de Oferta</option>
                  {/* Agrega más opciones según sea necesario */}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fechaAlta">
              <Form.Label column sm="2">Fecha de Alta:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="date" 
                  name="fechaAlta" 
                  value={obra.fechaAlta} 
                  onChange={handleChange} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="usuarioAlta">
              <Form.Label column sm="2">Usuario Alta:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="usuarioAlta" 
                  value={obra.usuarioAlta} 
                  onChange={handleChange} 
                  placeholder="(ABAC) Ábaco" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fechaPrevistaFin">
              <Form.Label column sm="2">Fecha Prevista Fin:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="date" 
                  name="fechaPrevistaFin" 
                  value={obra.fechaPrevistaFin} 
                  onChange={handleChange} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="numHorasPrevistas">
              <Form.Label column sm="2">Num. Horas Previstas:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="number" 
                  name="numHorasPrevistas" 
                  value={obra.numHorasPrevistas} 
                  onChange={handleChange} 
                  step="0.1" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="gastoPrevisto">
              <Form.Label column sm="2">Gasto Previsto:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="number" 
                  name="gastoPrevisto" 
                  value={obra.gastoPrevisto} 
                  onChange={handleChange} 
                  step="0.1" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="importe">
              <Form.Label column sm="2">Importe:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="number" 
                  name="importe" 
                  value={obra.importe} 
                  onChange={handleChange} 
                  step="0.1" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="viabilidad">
              <Form.Label column sm="2">Viabilidad:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="number" 
                  name="viabilidad" 
                  value={obra.viabilidad} 
                  onChange={handleChange} 
                  step="1" 
                  min="0" 
                  max="100" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="empresa">
              <Form.Label column sm="2">Empresa:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="empresa" 
                  value={obra.empresa} 
                  onChange={handleChange} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="contacto">
              <Form.Label column sm="2">Contacto:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="contacto" 
                  value={obra.contacto} 
                  onChange={handleChange} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="complejo">
              <Form.Label column sm="2">Complejo:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="text" 
                  name="complejo" 
                  value={obra.complejo} 
                  onChange={handleChange} 
                  placeholder="Sin Asignar Complejo" 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="observaciones">
              <Form.Label column sm="2">Observaciones:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  as="textarea" 
                  name="observaciones" 
                  value={obra.observaciones} 
                  onChange={handleChange} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="observacionesInternas">
              <Form.Label column sm="2">Observaciones Internas:</Form.Label>
              <Col sm="10">
                <Form.Control 
                  as="textarea" 
                  name="observacionesInternas" 
                  value={obra.observacionesInternas} 
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