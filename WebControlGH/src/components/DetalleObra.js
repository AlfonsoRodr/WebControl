import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, Card, Accordion } from 'react-bootstrap';
import { obras } from './obrasData'; 

const DetalleObra = () => {
  const { cod } = useParams(); // Obtiene el código de la obra desde la URL
  const navigate = useNavigate();

    // Definir el estado para el checkbox "En Seguimiento"
    const [enSeguimiento, setEnSeguimiento] = useState(false);


  // Buscar la obra seleccionada
  const obra = obras.find((obra) => obra.cod === cod);

  //carga pedidos y facturas
  const [pedidos, setPedidos] = useState(obra?.pedidos || []);
  const [facturas, setFacturas] = useState(obra?.facturas || []);

  if (!obra) {
    return <h2>Obra no encontrada</h2>;
  }

    // Función para eliminar un pedido
    const handleDeletePedido = (codigoPedido) => {
      setPedidos(pedidos.filter((pedido) => pedido.codigo !== codigoPedido));
    };
  
    // Función para eliminar una factura
    const handleDeleteFactura = (codigoFactura) => {
      setFacturas(facturas.filter((factura) => factura.codigo !== codigoFactura));
    };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Edición de Obra</h2>

      {/* Contenedor de edición */}
      <Card className="p-3 mb-3">
        <Form>
          <Form.Group controlId="obraCod">
            <Form.Label><strong>Código de Obra:</strong></Form.Label>
            <Form.Control type="text" value={obra.cod} readOnly />
          </Form.Group>

          <Form.Group controlId="obraDescripcion" className="mt-2">
            <Form.Label><strong>Descripción:</strong></Form.Label>
            <Form.Control as="textarea" value={obra.descripcion} readOnly />
          </Form.Group>

          <Form.Check 
            type="checkbox"
            label="En Seguimiento"
            checked={enSeguimiento}
            onChange={() => setEnSeguimiento(!enSeguimiento)}
            className="mt-3"
          />
        </Form>

        {/* Botones */}
        <div className="d-flex mt-3">
        <Button variant="primary" className="w-auto px-3 me-2" disabled>Editar Obra</Button>
        <Button variant="danger" className="w-auto px-3">Baja Obra</Button>
        </div>
      </Card>

      {/* Sección de información en desplegables */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Información General</Accordion.Header>
          <Accordion.Body>
            <p><strong>Tipo:</strong> {obra.tipo}</p>
            <p><strong>Facturable:</strong> {obra.facturable ? 'Sí' : 'No'}</p>
            <p><strong>Estado:</strong> {obra.estado}</p>
            <p><strong>Fecha de Alta:</strong> {obra.fechaAlta}</p>
            <p><strong>Usuario Alta:</strong> {obra.fOferta}</p> 
            <p><strong>Fecha Prevista:</strong> {obra.fechaPrevista}</p>
            <p><strong>Número de Horas Previstas:</strong> {obra.horasPrevistas}</p>
            <p><strong>Gasto Previsto:</strong> {obra.gastoPrevisto}</p>
            <p><strong>Importe:</strong> {obra.importe}</p>
            <p><strong>Viabilidad:</strong> {obra.viabilidad}</p>
            <p><strong>Empresa:</strong> {obra.empresa}</p>
            <p><strong>Contacto:</strong> {obra.contacto}</p>
            <p><strong>Complejo:</strong> {obra.complejo}</p>
            <p><strong>Observaciones:</strong> {obra.obs}</p>
            <p><strong>Observaciones Internas:</strong> {obra.obsInternas}</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

   {/* Pedidos y Facturas */}
   <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="1">
        <Accordion.Header>Pedidos y Facturas de la Obra</Accordion.Header>
        <Accordion.Body>
          {/* Pedidos de la Obra */}
          <h5>Pedidos de la Obra</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Código Pedido</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Facturado</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila de pedido */}
              <tr>
                <td>P-001</td>
                <td>2025-03-24</td>
                <td>1000€</td>
                <td>{obra.fP}</td> {/* Aquí se toma el fP de la obra para cada pedido */}
                <td>Observación de ejemplo</td>
                <td>
                  <Button variant="info" className="me-2">Detalle</Button>
                  <Button variant="danger">Eliminar</Button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Totales</strong>
            <p>Total Importe Pedidos: 1000€</p>
            <p>% Pedido de la Obra: {obra.fP}</p> {/* Muestra el porcentaje de la obra */}
          </div>

          {/* Facturas de la Obra */}
          <h5 className="mt-4">Facturas de la Obra</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Código Factura</th>
                <th>Fecha</th>
                <th>Cobrado</th>
                <th>Importe</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo de fila de factura */}
              <tr>
                <td>P-001</td>
                <td>F-001</td>
                <td>2025-03-24</td>
                <td>Sí</td>
                <td>1000€</td>
                <td>Observación de ejemplo</td>
                <td>
                  <Button variant="info" className="me-2">Detalle</Button>
                  <Button variant="danger">Eliminar</Button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Totales</strong>
            <p>Total Importe Facturas: 1000€</p>
            <p>% Facturado de la Obra: {obra.fP}</p> {/* Muestra el porcentaje de la obra */}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    <Accordion defaultActiveKey="2">
      <Accordion.Item eventKey="2">
        <Accordion.Header>Horas y Gastos</Accordion.Header>
        <Accordion.Body>
          {/* Horas imputadas a la Obra */}
          <h5>Horas Imputadas a la Obra</h5>
          <Form.Check 
            type="checkbox"
            label="Mostrar listado de horas"
            className="mb-3"
          />
          <p><strong>Fecha Hora Inicial:</strong> 2024-03-01</p>
          <p><strong>Fecha Hora Final:</strong> 2024-03-01</p>
          <div className="mt-3">
            <strong>Totales Horas</strong>
            <p>Total Horas Imputadas: {obra.horasImputadas}</p>
            <p>Total Importe Horas: 2000€</p>
          </div>

          {/* Horas Extras de la Obra */}
          <h5 className="mt-4">Horas Extras de la Obra</h5>
          <p><strong>Fecha Hora Extra Inicial:</strong> 2024-03-01</p>
          <p><strong>Fecha Hora Extra Final:</strong> 2024-03-01</p>
          <div className="mt-3">
            <strong>Totales Horas Extras</strong>
            <p>Total Cantidad Horas Extra: 10</p>
            <p>Total Importe Horas Extra: 500€</p>
          </div>

          {/* Gastos Generales */}
          <h5 className="mt-4">Gastos Generales</h5>
          <Form.Check 
            type="checkbox"
            label="Mostrar listado de gastos"
            className="mb-3"
          />
          <p><strong>Fecha Gasto Inicial:</strong> 2024-03-01</p>
          <p><strong>Fecha Gasto Final:</strong> 2024-03-10</p>
          <div className="mt-3">
            <strong>Totales Gastos Generales</strong>
            <p>Kilómetros Coche Empresa: 48</p>
            <p>Comida/Cena: 100€</p>
            <p>Otros: 50€</p>
            <p><strong>Total Importe Gastos: 198€</strong></p>
          </div>

             {/* Gastos de Almacen*/}
             <h5 className="mt-4">Gastos Generales</h5>
      
          <div className="mt-3">
            <strong>Totales Almacen</strong>
            <p>Total Importe Almacen: 0.0</p>
  
          </div>

             {/* Gastos de Compras */}
             <h5 className="mt-4">Gastos de Compras</h5>
    
          <div className="mt-3">
            <strong>Totales Compras</strong>
            <p>Total Importe Compras: 0.0</p>
            <p><strong>Total Horas/Gastos</strong></p>
            <p>Total Gastos/Horas de la Obra: 7,911.04</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    <Accordion defaultActiveKey="3">
      <Accordion.Item eventKey="3">
        <Accordion.Header>Horas y Gastos Obras Subordinadas</Accordion.Header>
        <Accordion.Body>
          {/* Horas imputadas a la Obra */}
          <h5>Horas Imputadas a la Obra</h5>
          <Form.Check 
            type="checkbox"
            label="Mostrar listado de horas de las Obras Subordinadas"
            className="mb-3"
          />
             <div className="mt-3">
            <strong>Totales Horas</strong>
            <p>Total Importe Horas Obras Subordinadas: 48</p>

          </div>
          
          {/* Horas Extras de las Obras Subordinadas */}
          <h5 className="mt-4">Horas Extras de la Obra</h5>
          <div className="mt-3">
            <strong>Totales Horas Extras</strong>
            <p>Total Cantidad Horas Extra: 10</p>
            <p>Total Importe Horas Extra: 500€</p>
          </div>

          {/* Gastos de las Obras Subordinadas*/}
          <h5 className="mt-4">Gastos de las Obras Subordinadas</h5>
          <Form.Check 
            type="checkbox"
            label="Mostrar listado de gastos de las Obras Subordinadas" 
            className="mb-3" 
          />
      
          <div className="mt-3">
            <strong>Totales Gastos Generales</strong>
            <p>Kilómetros Coche Empresa: 48</p>
            <p>Comida/Cena: 100€</p>
            <p>Otros: 50€</p>
            <p><strong>Total Importe Gastos: 198€</strong></p>
          </div>

             {/* Gastos de Almacen*/}
             <h5 className="mt-4">Gastos de Almacen</h5>
          <div className="mt-3">
            <strong>Totales Almacen</strong>
            <p>Total Importe Almacen: 0.0</p>
  
          </div>

             {/* Gastos de Compras */}
             <h5 className="mt-4">Gastos de Compras</h5>
    
          <div className="mt-3">
            <strong>Totales Compras</strong>
            <p>Total Importe Compras: 0.0</p>
            <p><strong>Total Horas/Gastos</strong></p>
            <p>Total Gastos/Horas de la Obra: 7,911.04</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    <Accordion defaultActiveKey="4">
      <Accordion.Item eventKey="4">
        <Accordion.Header>Resumen</Accordion.Header>
        <Accordion.Body>
          <div className="mt-3">
          <h5>Resumen Obra:</h5>
            <p>H.Previstas: {obras.horasPrevistas}</p>
            <p>H. Reales: {obras.horasImputadas}</p>
            <p>Gasto Personal: 2000</p>
            <p>H. Totales: </p>
            <p>H.Extra: </p>
            <p>Gasto H.Extra:</p>
            <p>Gasto Prev:</p>
            <p>G.Real: </p>
            <p>G.Almacen:</p>
            <p>G.Compras:</p>
            <p>Importe:</p>
            <p>Sum P:</p>
            <p>Sum F:</p>
            <p>Pte P:</p>
            <p>G.Total:</p>
            <p>Rentabilidad</p>
            <p>%Rent:</p>
          </div>
      
          <div className="mt-3">
          <h5>Resumen Obras Subordinadas</h5>
            <p>H.Previstas:</p>
            <p>H.Reales:</p>
            <p>G.Personal:</p>
            <p>H.Totales:</p>
            <p>H.Extra:</p>
            <p>Gasto H.Extra:</p>
            <p>Gasto Prev:</p>
            <p>G.Real:</p>
            <p>G.Almacen:</p>
            <p>G.Compras:</p>
            <p>Importe:</p>
            <p>Sum P:</p>
            <p>Sum F:</p>
            <p>Pte P:</p>
            <p>G.Total:</p>
            <p>Rentabilidad</p>
            <p>%Rent:</p>
          </div>


          <div className="mt-3">
            <h5>Resumen Obras + Subordinadas: </h5>
            <p>Importe: </p>
            <p>G.Total: </p>
            <p>Rentabilidad: </p>
            <p>%Rent: </p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>


      <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
    </Container>
  );
};

export default DetalleObra;