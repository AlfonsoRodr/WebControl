import React, { useState } from 'react';
import { Collapse, Form, Button, Table, Pagination, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { facturas } from './ComprasData';

function GestionCompras() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fechaInicioFactura: '',
    fechaFinFactura: '',
    proveedor: '',
    tipoFactura: '',
    buscarTexto: ''
  });
  // Modificación Mohamed: He añadido facturas como estado por defecto.
  const [filteredFacturas, setFilteredFacturas] = useState(facturas); // Aquí iría tu array de facturas
  const [currentPage, setCurrentPage] = useState(1);
  const facturasPorPagina = 5;
  const [selectedFacturas, setSelectedFacturas] = useState([]);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = () => {
    let filtered = facturas;

    if (formData.fechaInicioFactura) {
      filtered = filtered.filter(
        f => new Date(f.fechaFactura) >= new Date(formData.fechaInicioFactura)
      );
    }
    if (formData.fechaFinFactura) {
      filtered = filtered.filter(
        f => new Date(f.fechaFactura) <= new Date(formData.fechaFinFactura)
      );
    }
    if (formData.proveedor) {
      filtered = filtered.filter(
        f => f.proveedor.toLowerCase().includes(formData.proveedor.toLowerCase())
      );
    }
    if (formData.tipoFactura) {
      filtered = filtered.filter(
        f => f.tipo === formData.tipoFactura
      );
    }
    // Mohamed: De momento no existe el cmapo nombre ni descripción en las facturas, pero si se añade, este sería el filtro.
    if (formData.buscarTexto) {
      filtered = filtered.filter(
        f => f.nombre.toLowerCase().includes(formData.buscarTexto.toLowerCase()) ||
             f.descripcion.toLowerCase().includes(formData.buscarTexto.toLowerCase())
      );
    }

    setFilteredFacturas(filtered);
    setCurrentPage(1); // reset página al buscar
  };

  const handleCheckboxChange = (facturaId) => {
    setSelectedFacturas(prev =>
      prev.includes(facturaId)
        ? prev.filter(id => id !== facturaId)
        : [...prev, facturaId]
    );
  };

  const handleImprimirFacturas = () => {
    if (selectedFacturas.length === 0) {
      alert("Selecciona al menos una factura para imprimir.");
      return;
    }
    console.log("Facturas seleccionadas para imprimir:", selectedFacturas);
  };

  // Paginación.
  // Modificación Mohamed: He retirado la condición que hacía que si no había filtros se mostraran todas las facturas.
  // Es mejor que el usuario vea que no hay facturas que cumplan los criterios de búsqueda.
  const indexOfLastFactura = currentPage * facturasPorPagina;
  const indexOfFirstFactura = indexOfLastFactura - facturasPorPagina;
  const facturasActuales =  filteredFacturas.slice(indexOfFirstFactura, indexOfLastFactura)
  const totalPaginas = Math.ceil((filteredFacturas.length || facturas.length) / facturasPorPagina);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="gestion-compras">
      <h3>Listado de Facturas</h3>

      <div style={{ textAlign: 'left' }}>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="filtros-collapse"
          aria-expanded={open}
          style={{ backgroundColor: '#d4edda', color: '#155724', border: 'none', marginBottom: '1rem' }}
        >
          Criterios de Búsqueda
        </Button>
      </div>

      <Collapse in={open}>
        <div id="filtros-collapse" className="mb-4 p-3 border rounded" style={{ backgroundColor: '#e8f5e9' }}>
          <Form>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Fecha Inicio Factura</Form.Label>
                  <Form.Control type="date" name="fechaInicioFactura" value={formData.fechaInicioFactura} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Fecha Fin Factura</Form.Label>
                  <Form.Control type="date" name="fechaFinFactura" value={formData.fechaFinFactura} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Control type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} placeholder="Nombre del proveedor" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tipo de Factura</Form.Label>
                  <Form.Select name="tipoFactura" value={formData.tipoFactura} onChange={handleChange}>
                    <option value="">Selecciona</option>
                    <option value="GASTOS GENERALES">GASTOS GENERALES</option>
                    <option value="TIKETS GASTOS-VISA">TIKETS GASTOS-VISA</option>
                    <option value="SEGUROS">SEGUROS</option>
                    <option value="SEGUROS SOCIALES">SEGUROS SOCIALES</option>
                    <option value="PERSONAL AUTONOMO">PERSONAL AUTONOMO</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </Collapse>

      <div className="d-flex mb-4">
  <Form.Control
    type="text"
    name="buscarTexto"
    value={formData.buscarTexto}
    onChange={handleChange}
    placeholder="Buscar por nombre o descripción"
    style={{ maxWidth: '400px' }}
  />
  <Button variant="success" onClick={handleSearch} className="ms-2">Buscar</Button>
</div>


      <Container>
        <Row className="mb-3">
          <Col className="text-end">
            <Button className="custom-button me-2">Nueva Factura</Button>
            <Button className="custom-button me-2">Baja Factura</Button>
            <Button className="custom-button me-2">Importar desde DQEMS</Button>
            <Button onClick={handleImprimirFacturas} className="custom-button">Imprimir Facturas</Button>
          </Col>
        </Row>
      </Container>

      <Table striped bordered hover>
        <thead>
        <tr>
        <th>Seleccionar</th>
        <th>Número</th>
        <th>Fecha</th>
        <th>Concepto</th>
        <th>Proveedor</th>
        <th>Tipo</th>
        <th>Base IVA</th>
        <th>Total IVA</th>
        <th>Total</th>
        <th>Asignado</th>
        <th>Acción</th>
        </tr>
        </thead>

        <tbody>
  {facturasActuales.length > 0 ? (
    facturasActuales.map((factura, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            checked={selectedFacturas.includes(factura.numero)}
            onChange={() => handleCheckboxChange(factura.numero)}
          />
        </td>
        <td>{factura.numero}</td>
        <td>{factura.fechaFactura}</td>
        <td>{factura.concepto}</td>
        <td>{factura.proveedor}</td>
        <td>{factura.tipo}</td>
        <td>{factura.baseIva}</td>
        <td>{factura.totalIva}</td>
        <td>{factura.total}</td>
        <td>{factura.asignado ? 'Sí' : 'No'}</td>
        <td>
          <Button variant="info" onClick={() => navigate(`/home/gestion-compras/detalle/${factura.numero}`)}>
            Detalle
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="11">No se encontraron facturas</td>
    </tr>
  )}
</tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default GestionCompras;