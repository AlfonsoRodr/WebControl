import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Form, Card, Accordion } from "react-bootstrap";
import { obras } from "../obrasData";
import axios from "axios";

const DetalleObra = () => {
  const { idObra } = useParams(); // Obtiene el código de la obra desde la URL
  const navigate = useNavigate();

  // Definir el estado para el checkbox "En Seguimiento"
  const [enSeguimiento, setEnSeguimiento] = useState(false);

  // Estado para la obra filtrada
  const [filteredObra, setFilteredObra] = useState({});
  // Estado para la rentabilidad de la obra
  const [rentabilidadObra, setRentabilidadObra] = useState({});
  // Estado para las facturas asociadas a una obra
  const [facturasObra, setFacturasObra] = useState([]);
  // Estado para los pedidos asociados a una obra
  const [pedidosObra, setPedidosObra] = useState([]);

  // Buscar la obra seleccionada
  const obra = [];

  // ----------------------- FETCH DE DATOS ------------------------------- \\

  // Fetch de la obra
  const fetchObra = async (idObra) => {
    const endpoint = `http://localhost:3002/api/obra/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFilteredObra(res.data[0]);
    } catch (err) {
      console.error(`Error al obtener la obra - ${err}`);
    }
  };

  // Fetch de la rentabilidad
  const fetchRentabilidad = async (idObra) => {
    const endpoint = `http://localhost:3002/api/rentabilidad/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setRentabilidadObra(res.data[0]);
      console.log(res.data[0]);
    } catch (err) {
      console.error(`Error al obtener la rentabilidad - ${err}`);
    }
  };

  // Fetch de las facturas asociadas a una obra
  const fetchFacturas = async (idObra) => {
    const endpoint = `http://localhost:3002/api/ecoFactura/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFacturasObra(res.data);
    } catch (err) {
      console.error(`Error al obtener las facturas de la obra - ${err}`);
    }
  };

  // Fetch de los pedidos asociados a una obra
  const fetchPedidos = async (idObra) => {
    const endpoint = `http://localhost:3002/api/ecoPedido/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setPedidosObra(res.data);
    } catch (err) {
      console.error(`Error al obtener los pedidos de la obra - ${err}`);
    }
  };

  // ---------------------------------------------------------------------- \\

  useEffect(() => {
    fetchObra(idObra);
    fetchRentabilidad(idObra);
    fetchFacturas(idObra);
    fetchPedidos(idObra);
  }, []);

  if (!filteredObra) {
    return <h2>Obra no encontrada</h2>;
  }

  // Función para eliminar un pedido
  const handleDeletePedido = (codigoPedido) => {
    /*setPedidos(pedidos.filter((pedido) => pedido.codigo !== codigoPedido));*/
  };

  // Función para eliminar una factura
  const handleDeleteFactura = (codigoFactura) => {
    /*setFacturas(facturas.filter((factura) => factura.codigo !== codigoFactura));*/
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Edición de Obra</h2>

      {/* Contenedor de edición */}
      <Card className="p-3 mb-3">
        <Form>
          <Form.Group controlId="obraCod">
            <Form.Label>
              <strong>Código de Obra:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={filteredObra.codigo_obra}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="obraDescripcion" className="mt-2">
            <Form.Label>
              <strong>Descripción:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredObra.descripcion_obra}
              readOnly
            />
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
          <Button variant="primary" className="w-auto px-3 me-2" disabled>
            Editar Obra
          </Button>
          <Button variant="danger" className="w-auto px-3">
            Baja Obra
          </Button>
        </div>
      </Card>

      {/* Sección de información en desplegables */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Información General</Accordion.Header>
          <Accordion.Body>
            <p>
              <strong>Tipo:</strong> {filteredObra.desc_tipo_obra}
            </p>
            <p>
              <strong>Facturable:</strong> {filteredObra.facturable}
            </p>
            <p>
              <strong>Estado:</strong> {filteredObra.desc_estado_obra}
            </p>
            <p>
              <strong>Fecha de Alta:</strong>{" "}
              {new Date(filteredObra.fecha_alta).toLocaleDateString("es-Es")}
            </p>
            <p>
              <strong>Usuario Alta:</strong>{" "}
              {`${filteredObra.nombre_usuario} ${filteredObra.apellido_1_usuario} ${filteredObra.apellido_2_usuario}`}
            </p>
            <p>
              <strong>Fecha Prevista:</strong> {filteredObra.fecha_prevista_fin}
            </p>
            <p>
              <strong>Número de Horas Previstas:</strong>{" "}
              {filteredObra.horas_previstas}
            </p>
            <p>
              <strong>Gasto Previsto:</strong> {filteredObra.gasto_previsto}
            </p>
            <p>
              <strong>Importe:</strong> {filteredObra.importe}
            </p>
            <p>
              <strong>Viabilidad:</strong> {filteredObra.viabilidad}
            </p>
            <p>
              <strong>Empresa:</strong> {filteredObra.nombre_empresa}
            </p>
            <p>
              <strong>Contacto:</strong>{" "}
              {`${filteredObra.nombre_contacto} ${filteredObra.apellido_1_contacto} ${filteredObra.apellido_2_contacto}`}
            </p>
            <p>
              <strong>Complejo:</strong> {filteredObra.nombre_edificio}
            </p>
            <p>
              <strong>Observaciones:</strong> {filteredObra.observaciones}
            </p>
            <p>
              <strong>Observaciones Internas:</strong>{" "}
              {filteredObra.observaciones_internas}
            </p>
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
                {pedidosObra.length > 0 ? (
                  pedidosObra.map((pedido, index) => (
                    <tr key={index}>
                      <td>{pedido.codigo_pedido}</td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.importe}</td>
                      <td>
                        {(rentabilidadObra.ptePedido /
                          rentabilidadObra.pteObra) *
                          100}
                      </td>{" "}
                      {/* Aquí se toma el fP de la obra para cada pedido */}
                      <td>{pedido.observaciones}</td>
                      <td>
                        <Button variant="info" className="me-2">
                          Detalle
                        </Button>
                        <Button variant="danger">Eliminar</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">No hay pedidos asociados</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3">
              <strong>Totales</strong>
              <p>Total Importe Pedidos: {rentabilidadObra.sumPedido}</p>
              <p>
                % Pedido de la Obra:{" "}
                {(rentabilidadObra.sumPedido / rentabilidadObra.importe) * 100}
              </p>{" "}
              {/* Muestra el porcentaje de la obra */}
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
                {facturasObra.length > 0 ? (
                  facturasObra.map((factura, index) => (
                    <tr key={index}>
                      <td>{factura.codigo_pedido}</td>
                      <td>{factura.codigo_factura}</td>
                      <td>
                        {new Date(factura.fecha).toLocaleDateString("es-Es")}
                      </td>
                      <td>
                        {new Date(factura.fecha_cobro).toLocaleDateString(
                          "es-Es"
                        )}
                      </td>
                      <td>{factura.importe}</td>
                      <td>{factura.observaciones}</td>
                      <td>
                        <Button variant="info" className="me-2">
                          Detalle
                        </Button>
                        <Button variant="danger">Eliminar</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">No hay facturas asociados</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3">
              <strong>Totales</strong>
              <p>Total Importe Facturas: {rentabilidadObra.sumFactura}</p>
              <p>
                % Facturado de la Obra:{" "}
                {(rentabilidadObra.sumFactura / rentabilidadObra.importe) * 100}
              </p>{" "}
              {/* Muestra el porcentaje de la obra */}
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
            <p>
              <strong>Fecha Hora Inicial:</strong>{" "}
              {rentabilidadObra.fechaHoraInicial
                ? new Date(
                    rentabilidadObra.fechaHoraInicial
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <p>
              <strong>Fecha Hora Final:</strong>{" "}
              {rentabilidadObra.fechaHoraFinal
                ? new Date(
                    rentabilidadObra.fechaHoraFinal
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <div className="mt-3">
              <strong>Totales Horas</strong>
              <p>Total Horas Imputadas: {rentabilidadObra.horasTotal}</p>
              <p>Total Importe Horas: {rentabilidadObra.gastoPersonal}</p>
            </div>

            {/* Horas Extras de la Obra */}
            <h5 className="mt-4">Horas Extras de la Obra</h5>
            <p>
              <strong>Fecha Hora Extra Inicial:</strong>{" "}
              {rentabilidadObra.fechaGastoInicial
                ? new Date(
                    rentabilidadObra.fechaGastoInicial
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <p>
              <strong>Fecha Hora Extra Final:</strong>{" "}
              {rentabilidadObra.fechaGastoFinal
                ? new Date(
                    rentabilidadObra.fechaGastoFinal
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <div className="mt-3">
              <strong>Totales Horas Extras</strong>
              <p>Total Cantidad Horas Extra: {rentabilidadObra.horasExtra}</p>
              <p>
                Total Importe Horas Extra:{" "}
                {rentabilidadObra.gastoPersonalExtra ?? "Sin especificar"}
              </p>
            </div>

            {/* Gastos Generales */}
            <h5 className="mt-4">Gastos Generales</h5>
            <Form.Check
              type="checkbox"
              label="Mostrar listado de gastos"
              className="mb-3"
            />
            <p>
              <strong>Fecha Gasto Inicial:</strong>{" "}
              {rentabilidadObra.fechaGastoInicial
                ? new Date(
                    rentabilidadObra.fechaGastoInicial
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <p>
              <strong>Fecha Gasto Final:</strong>{" "}
              {rentabilidadObra.fechaGastoFinal
                ? new Date(
                    rentabilidadObra.fechaGastoFinal
                  ).toLocaleDateString("es-Es")
                : "Sin especificar"}
            </p>
            <div className="mt-3">
              <strong>Totales Gastos Generales</strong>
              <p>Kilómetros Coche Empresa: Sin incluir</p>
              <p>Comida/Cena: Sin incluir</p>
              <p>Otros: Sin incluir</p>
              <p>
                <strong>Total Importe Gastos:</strong>
                {rentabilidadObra.gastoReal}
              </p>
            </div>

            {/* Gastos de Almacen*/}
            <h5 className="mt-4">Gastos Generales</h5>

            <div className="mt-3">
              <strong>Totales Almacen</strong>
              <p>Total Importe Almacen: Sin incluir</p>
            </div>

            {/* Gastos de Compras */}
            <h5 className="mt-4">Gastos de Compras</h5>

            <div className="mt-3">
              <strong>Totales Compras</strong>
              <p>Total Importe Compras: Sin incluir</p>
              <p>
                <strong>Total Horas/Gastos</strong>
              </p>
              <p>Total Gastos/Horas de la Obra: Sin incluir</p>
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
              <p>
                <strong>Total Importe Gastos: 198€</strong>
              </p>
            </div>

            {/* Gastos de Almacen*/}
            <h5 className="mt-4">Gastos de Almacen</h5>
            <div className="mt-3">
              <strong>Totales Almacen</strong>
              <p>Total Importe Almacen: Sin incluir</p>
            </div>

            {/* Gastos de Compras */}
            <h5 className="mt-4">Gastos de Compras</h5>

            <div className="mt-3">
              <strong>Totales Compras</strong>
              <p>Total Importe Compras: Sin incluir</p>
              <p>
                <strong>Total Horas/Gastos</strong>
              </p>
              <p>Total Gastos/Horas de la Obra: Sin incluir</p>
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
              <p>
                <strong>H.Previstas</strong>: {rentabilidadObra.horas_previstas}
              </p>
              <p>
                <strong>H. Reales</strong>: {rentabilidadObra.horasReal}
              </p>
              <p>
                <strong>Gasto Personal (GP)</strong>:{" "}
                {rentabilidadObra.gastoPersonal}
              </p>
              <p>
                <strong>H. Totales</strong>: {rentabilidadObra.horasTotal}
              </p>
              <p>
                <strong>G.Personal Total (GP + GHE)</strong>:{" "}
                {rentabilidadObra.gastoPersonalTotal ?? "Sin especificar"}
              </p>
              <p>
                <strong>H.Extra</strong>: {rentabilidadObra.horasExtra}
              </p>
              <p>
                <strong>Gasto H.Extra (GHE)</strong>:
                {rentabilidadObra.gastoPersonalExtra ?? "Sin especificar"}
              </p>
              <p>
                <strong>Gasto Prev</strong>: {rentabilidadObra.gasto_previsto}
              </p>
              <p>
                <strong>G.Real (GR)</strong>: {rentabilidadObra.gastoReal}
              </p>
              <p>
                <strong>G.Almacen (GA)</strong>: Por incluir
              </p>
              <p>
                <strong>G.Compras (GC)</strong>: Por incluir
              </p>
              <p>
                <strong>Importe</strong>:{rentabilidadObra.importe}
              </p>
              <p>
                <strong>Sum P</strong>:{rentabilidadObra.sumPedido}
              </p>
              <p>
                <strong>Sum F</strong>:{rentabilidadObra.sumFactura}
              </p>
              <p>
                <strong>Pte P</strong>:{rentabilidadObra.ptePedido}
              </p>
              <p>
                <strong>Pte F</strong>:{rentabilidadObra.pteFactura}
              </p>
              <p>
                <strong>G.Total (GP + GR + GHE + GA + GC)</strong>:{" "}
                {rentabilidadObra.gastoPersonal +
                  rentabilidadObra.gastoReal +
                  rentabilidadObra.gastoPersonalExtra}
              </p>
              <p>
                <strong>Rentabilidad</strong>: {rentabilidadObra.rentabilidad}
              </p>
              <p>
                <strong>%Rent</strong>:{rentabilidadObra.rentabilidadPorcentaje}
              </p>
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

      <Button className="mt-4" onClick={() => navigate(-1)}>
        Volver
      </Button>
    </Container>
  );
};

export default DetalleObra;
