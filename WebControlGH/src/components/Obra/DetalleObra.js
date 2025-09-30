import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Card,
  Accordion,
  ListGroup,
} from "react-bootstrap";
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
  // Estado para los gastos asociados a una obra
  const [gastosObra, setGastosObra] = useState([]);
  // Estado para los gastos asociados a las obras hijas
  const [gastosObrasHijas, setGastosObrasHijas] = useState([]);
  // Estado para el listado de horas asociadas a una obra
  const [horasObra, setHorasObra] = useState([]);
  // Estado para el listado de horas asociadas a las obras hijas
  const [horasObrasHijas, setHorasObrasHijas] = useState([]);
  // Estado para el listado de horas extra asociadas a una obra
  const [horasExtraObra, setHorasExtraObra] = useState([]);
  // Estado para el listado de horas extra asociadas a las obras hijas
  const [horasExtraObrasHijas, setHorasExtraObrasHijas] = useState([]);

  // --------- ESTADOS PARA LA BUSQUEDA DE OBRA PADRE Y SUBORDINADAS --------- \\
  // Estado para la obra padre
  const [obraPadre, setObraPadre] = useState({});
  // Estado para las obras hijas
  const [obrasHijas, setObrasHijas] = useState([]);

  const [obraPadreBusqueda, setObraPadreBusqueda] = useState("");
  const [sugerenciasPadre, setSugerenciasPadre] = useState([]);
  const [obraPadreSeleccionada, setObraPadreSeleccionada] = useState(null);

  const [obraHijaBusqueda, setObraHijaBusqueda] = useState("");
  const [sugerenciasHijas, setSugerenciasHijas] = useState([]);
  const [obrasHijasSeleccionadas, setObrasHijasSeleccionadas] = useState([]);

  // ----------------------------------------------------------------------------- \\

  // Estado para los tipos de gastos
  const [tiposGastos, setTiposGastos] = useState([]);
  // Estado para los tipos de gastos de obras subordinada
  const [tiposGastosHijas, setTiposGastosHijas] = useState([]);
  // Estado para mostrar la lista de gastos
  const [mostrarGastos, setMostrarGastos] = useState(false);
  // Estado para mostrar la lista de horas
  const [mostrarHoras, setMostrarHoras] = useState(false);
  // Estado para mostrar la lista de gastos de obras subordinadas
  const [mostrarGastosHijas, setMostrarGastosHijas] = useState(false);
  // Estado para mostrar la lista de horas de obras subordinadas
  const [mostrarHorasHijas, setMostrarHorasHijas] = useState(false);

  // ----------------------- FETCH DE DATOS ------------------------------- \\

  // Fetch de la obra
  const fetchObra = async (idObra) => {
    const endpoint = `http://localhost:3002/api/obra/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFilteredObra(res.data.data[0]);
    } catch (err) {
      console.error(`Error al obtener la obra - ${err}`);
    }
  };

  // Fetch de la rentabilidad
  const fetchRentabilidad = async (idObra) => {
    const endpoint = `http://localhost:3002/api/rentabilidad/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setRentabilidadObra(res.data.data);
    } catch (err) {
      console.error(`Error al obtener la rentabilidad - ${err}`);
    }
  };

  // Fetch de las facturas asociadas a una obra
  const fetchFacturas = async (idObra) => {
    const endpoint = `http://localhost:3002/api/ecoFactura/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFacturasObra(res.data.data);
    } catch (err) {
      console.error(`Error al obtener las facturas de la obra - ${err}`);
    }
  };

  // Fetch de los pedidos asociados a una obra
  const fetchPedidos = async (idObra) => {
    const endpoint = `http://localhost:3002/api/ecoPedido/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setPedidosObra(res.data.data);
    } catch (err) {
      console.error(`Error al obtener los pedidos de la obra - ${err}`);
    }
  };

  // Fetch de los gastos asociados a una obra
  const fetchGastos = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/gastos/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      setGastosObra(res.data.data);
      getTiposGastos(res.data.data, "Padre");
    } catch (err) {
      console.error(`Error al obtener los gastos de la obra - ${err}`);
    }
  };

  // Fetch de los gastos asociados a una obra
  const fetchGastosHijas = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/gastos/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      setGastosObrasHijas(res.data.data);
      getTiposGastos(res.data.data, "Hijas");
      console.log(res.data.data);
    } catch (err) {
      console.error(`Error al obtener los gastos de las obras hijas - ${err}`);
    }
  };

  // Fetch de las horas asociadas a una obra
  const fetchHoras = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/horas/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      setHorasObra(res.data.data);
    } catch (error) {
      console.error(`Error al obtener las horas de la obra - ${error}`);
    }
  };

  // Fetch de las horas asociadas a las obras subordinadas
  const fetchHorasHijas = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/horas/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      setHorasObrasHijas(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(`Error al obtener las horas de las obras hijas - ${error}`);
    }
  };

  // Fetch de las horas extra asociadas a una obra
  const fetchHorasExtra = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/gastos/horas-extra/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      setHorasExtraObra(res.data.data);
    } catch (error) {
      console.error(`Error al obtener las horas extra de la obra - ${error}`);
    }
  };

  // Fetch de las horas extra de las obras subordinadas
  const fetchHorasExtraHijas = async (idsObra) => {
    const endpoint = `http://localhost:3002/api/gastos/horas-extra/buscar`;
    console.log(idsObra);
    try {
      const res = await axios.post(endpoint, { idsObra });
      setHorasExtraObrasHijas(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(
        `Error al obtener las horas extra de las obras hijas - ${error}`
      );
    }
  };

  // Fetch de la obra padre
  const fetchObraPadre = async (idObra) => {
    const endpoint = `http://localhost:3002/api/relacion-obras/padre/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setObraPadre(res.data.data[0]);
      setObraPadreSeleccionada(res.data.data[0]);
    } catch (error) {
      console.error(`Error al obtener la obra padre - ${error}`);
    }
  };

  // Fetch de las obras hijas
  const fetchObrasHijas = async (idObra) => {
    const endpoint = `http://localhost:3002/api/relacion-obras/hijas/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setObrasHijas(res.data.data);
      setObrasHijasSeleccionadas(res.data.data);
      console.log("res.data.data", res.data.data);
      // IDs de las obras hijas
      const idsObrasHijas = res.data.data.map(
        (obraHija) => obraHija.id_obraHija
      );
      console.log("Desde fetchObrasHijas", idsObrasHijas);
      fetchGastosHijas(idsObrasHijas);
      fetchHorasHijas(idsObrasHijas);
      fetchHorasExtraHijas(idsObrasHijas);
    } catch (error) {
      console.error(`Error al obtener las obras hijas - ${error}`);
    }
  };

  // ---------------------------------------------------------------------- \\

  useEffect(() => {
    fetchObra(idObra);
    fetchRentabilidad(idObra);
    fetchFacturas(idObra);
    fetchPedidos(idObra);
    fetchGastos([idObra]);
    fetchHoras([idObra]);
    fetchHorasExtra([idObra]);
    fetchObraPadre(idObra);
    fetchObrasHijas(idObra);
  }, []);

  if (!filteredObra) {
    return <h2>Obra no encontrada</h2>;
  }

  // ----------------------------- HANDLERS y FUNCIONES AUXILIARES ----------------------- \\

  // Función para eliminar un pedido
  const handleDeletePedido = (codigoPedido) => {
    /*setPedidos(pedidos.filter((pedido) => pedido.codigo !== codigoPedido));*/
  };

  // Función para eliminar una factura
  const handleDeleteFactura = (codigoFactura) => {
    /*setFacturas(facturas.filter((factura) => factura.codigo !== codigoFactura));*/
  };

  // Funcion para obtener los diferentes tipos de gastos y el coste total de cada tipo de gasto.
  const getTiposGastos = (gastosObra, tipoObra) => {
    const resumen = {};

    gastosObra.forEach((gasto) => {
      if (gasto.tipo_gasto) {
        const totalGasto = gasto.cantidad * gasto.importe;
        if (!resumen[gasto.tipo_gasto]) {
          resumen[gasto.tipo_gasto] = 0;
        }
        resumen[gasto.tipo_gasto] += totalGasto;
        resumen[gasto.tipo_gasto] =
          Math.round(resumen[gasto.tipo_gasto] * 100) / 100;
      }
    });

    const tiposConImporte = Object.entries(resumen).map(([tipo, importe]) => ({
      tipo,
      importe: Number(importe.toFixed(2)),
    }));
    if (tipoObra === "Padre") {
      setTiposGastos(tiposConImporte);
    } else {
      setTiposGastosHijas(tiposConImporte);
    }
  };

  // Handlers para búsqueda y selección
  const handleObraPadreBusqueda = async (e) => {
    console.log("Buscando...");
  };

  const seleccionarObraPadre = (obra) => {
    console.log("Seleccionando...");
  };

  const eliminarObraPadre = () => {
    console.log("Eliminando...");
  };

  const handleObraHijaBusqueda = async (e) => {
    console.log("Buscando...");
  };

  const agregarObraHija = (obra) => {
    console.log("Agregando...");
  };

  const eliminarObraHija = (idObra) => {
    console.log("Eliminando");
  };

  // Suma de los gastos
  const totalImporteGastos = gastosObra.reduce(
    (acc, gasto) => acc + gasto.cantidad * gasto.importe,
    0
  );

  // Suma de las horas extra (No está bien registrado en la BBDD por eso se recalcula)
  const totalHorasExtra = horasExtraObra.reduce(
    (acc, hora) => acc + hora.cantidad,
    0
  );

  // Importe total de las horas extra (No está en la BBDD)
  const totalImporteHorasExtra = horasExtraObra.reduce(
    (acc, hora) => acc + hora.cantidad * hora.importe,
    0
  );

  // -------------------------------------------------------------------------------------- \\

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
              value={filteredObra.codigo_obra || ""}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="obraDescripcion" className="mt-2">
            <Form.Label>
              <strong>Descripción:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              value={filteredObra.descripcion_obra || ""}
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
          {/* BUSCADOR DE OBRA PADRE Y OBRAS SUBORDINADAS */}
          <Form.Group controlId="relacioObras" className="mt-2">
            <Form.Label>
              <strong>Relación con otras obras:</strong>
            </Form.Label>
            <div>
              {/* Obra Padre */}
              <div className="mb-2 position-relative">
                <strong>Depende de la obra:</strong>
                <Form.Control
                  type="text"
                  placeholder="Buscar obra padre..."
                  value={obraPadreBusqueda}
                  onChange={handleObraPadreBusqueda}
                  autoComplete="off"
                />
                {/* Sugerencias obra padre */}
                {sugerenciasPadre.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 10 }}
                  >
                    {sugerenciasPadre.map((obra) => (
                      <li
                        key={obra.id_obra}
                        className="list-group-item list-group-item-action"
                        onClick={() => seleccionarObraPadre(obra)}
                        style={{ cursor: "pointer" }}
                      >
                        {obra.codigo_obra} - {obra.descripcion_obra}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Obra padre seleccionada */}
                {obraPadreSeleccionada && (
                  <div className="mt-2">
                    <span>
                      <strong>Obra padre seleccionada:</strong>{" "}
                      {obraPadreSeleccionada.codigo_obra} -{" "}
                      {obraPadreSeleccionada.descripcion_obra}
                    </span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={eliminarObraPadre}
                    >
                      Quitar
                    </Button>
                  </div>
                )}
              </div>

              {/* Obras Hijas */}
              <div className="position-relative">
                <strong>Obras Subordinadas:</strong>
                <Form.Control
                  type="text"
                  placeholder="Buscar obra hija..."
                  value={obraHijaBusqueda}
                  onChange={handleObraHijaBusqueda}
                  autoComplete="off"
                />
                {/* Sugerencias obras hijas */}
                {sugerenciasHijas.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 10 }}
                  >
                    {sugerenciasHijas.map((obra) => (
                      <li
                        key={obra.id_obra}
                        className="list-group-item list-group-item-action"
                        onClick={() => agregarObraHija(obra)}
                        style={{ cursor: "pointer" }}
                      >
                        {obra.codigo_obra} - {obra.descripcion_obra}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Listado de obras hijas seleccionadas */}
                {obrasHijasSeleccionadas.length > 0 && (
                  <ListGroup className="mt-2">
                    {obrasHijasSeleccionadas.map((obra) => (
                      <ListGroup.Item
                        key={obra.id_obra}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {obra.codigo_obra} - {obra.descripcion_obra}
                        </span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => eliminarObraHija(obra.id_obra)}
                        >
                          Quitar
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </div>
          </Form.Group>
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
              <strong>Tipo:</strong> {filteredObra.desc_tipo_obra || ""}
            </p>
            <p>
              <strong>Facturable:</strong> {filteredObra.facturable || ""}
            </p>
            <p>
              <strong>Estado:</strong> {filteredObra.desc_estado_obra || ""}
            </p>
            <p>
              <strong>Fecha de Alta:</strong>{" "}
              {new Date(filteredObra.fecha_alta).toLocaleDateString("es-Es") ||
                ""}
            </p>
            <p>
              <strong>Usuario Alta:</strong>{" "}
              {`${filteredObra.nombre_usuario || ""} ${
                filteredObra.apellido_1_usuario || ""
              } ${filteredObra.apellido_2_usuario || ""}`}
            </p>
            <p>
              <strong>Fecha Prevista:</strong>{" "}
              {filteredObra.fecha_prevista_fin || ""}
            </p>
            <p>
              <strong>Número de Horas Previstas:</strong>{" "}
              {filteredObra.horas_previstas || ""}
            </p>
            <p>
              <strong>Gasto Previsto:</strong>{" "}
              {filteredObra.gasto_previsto || ""}
            </p>
            <p>
              <strong>Importe:</strong> {filteredObra.importe || ""}
            </p>
            <p>
              <strong>Viabilidad:</strong> {filteredObra.viabilidad || ""}
            </p>
            <p>
              <strong>Empresa:</strong> {filteredObra.nombre_empresa || ""}
            </p>
            <p>
              <strong>Contacto:</strong>{" "}
              {`${filteredObra.nombre_contacto || ""} ${
                filteredObra.apellido_1_contacto || ""
              } ${filteredObra.apellido_2_contacto || ""}`}
            </p>
            <p>
              <strong>Complejo:</strong> {filteredObra.nombre_edificio || ""}
            </p>
            <p>
              <strong>Observaciones:</strong> {filteredObra.observaciones || ""}
            </p>
            <p>
              <strong>Observaciones Internas:</strong>{" "}
              {filteredObra.observaciones_internas || ""}
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
                        {rentabilidadObra
                          ? (rentabilidadObra.ptePedido /
                              rentabilidadObra.pteObra) *
                            100
                          : "No hay datos de rentabilidad"}
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
              <p>
                Total Importe Pedidos:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.sumPedido
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                % Pedido de la Obra:{" "}
                {rentabilidadObra
                  ? (rentabilidadObra.sumPedido / rentabilidadObra.importe) *
                    100
                  : "No hay datos de rentabilidad"}
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
              <p>
                Total Importe Facturas:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.sumFactura
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                % Facturado de la Obra:{" "}
                {rentabilidadObra
                  ? (rentabilidadObra.sumFactura / rentabilidadObra.importe) *
                    100
                  : "No hay datos de rentabilidad"}
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
            <p>
              <strong>Fecha Hora Inicial:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaHoraInicial
                  ? new Date(
                      rentabilidadObra.fechaHoraInicial
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            <p>
              <strong>Fecha Hora Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaHoraFinal
                  ? new Date(
                      rentabilidadObra.fechaHoraFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            <Form.Check
              type="checkbox"
              label="Mostrar listado de horas"
              className="mb-3"
              checked={mostrarHoras}
              onChange={() => setMostrarHoras((prev) => !prev)}
            />

            {/* LISTADO DE HORAS */}
            {mostrarHoras && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Dia Trab.</th>
                    <th>Usu</th>
                    <th>Tarea</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>hrs.</th>
                    <th>p.h.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {horasObra.length > 0 ? (
                    horasObra.map((hora, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(hora.dia_trabajado).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario}</td>
                        <td>{hora.id_tarea}</td>
                        <td>
                          {new Date(hora.fecha_validacion).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario_validacion}</td>
                        <td>{hora.num_horas}</td>
                        <td>{hora.precio_hora}</td>
                        <td>{hora.num_horas * hora.precio_hora}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay horas asociadas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <div className="mt-3">
              <strong>Totales Horas</strong>
              <p>
                Total Horas Imputadas:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.horasReal
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                Total Importe Horas:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastoPersonal
                  : "No hay datos de rentabilidad"}
              </p>
            </div>

            {/* Horas Extras de la Obra */}
            <h5 className="mt-4">Horas Extras de la Obra</h5>
            <p>
              <strong>Fecha Hora Extra Inicial:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoInicial
                  ? new Date(
                      rentabilidadObra.fechaGastoInicial
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            <p>
              <strong>Fecha Hora Extra Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoFinal
                  ? new Date(
                      rentabilidadObra.fechaGastoFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            {/* LISTADO DE HORAS EXTRA*/}
            {mostrarHoras && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Dia Trab.</th>
                    <th>Usu</th>
                    <th>Tipo</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>Visa</th>
                    <th>Pagado</th>
                    <th>Cant.</th>
                    <th>i.u.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {horasExtraObra.length > 0 ? (
                    horasExtraObra.map((hora, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(hora.fecha_gasto).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario}</td>
                        <td>{hora.descripcion}</td>
                        <td>
                          {new Date(hora.fecha_validacion).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario_validacion}</td>
                        <td>{hora.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>
                          {new Date(hora.fecha_pago).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.cantidad}</td>
                        <td>{hora.importe}</td>
                        <td>{hora.cantidad * hora.importe}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay horas asociadas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <div className="mt-3">
              <strong>Totales Horas Extras</strong>
              <p>Total Cantidad Horas Extra: {totalHorasExtra ?? ""}</p>
              <p>Total Importe Horas Extra: {totalImporteHorasExtra ?? ""}</p>
            </div>

            {/* Gastos Generales */}
            <h5 className="mt-4">Gastos Generales</h5>
            <p>
              <strong>Fecha Gasto Inicial:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoInicial
                  ? new Date(
                      rentabilidadObra.fechaGastoInicial
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            <p>
              <strong>Fecha Gasto Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoFinal
                  ? new Date(
                      rentabilidadObra.fechaGastoFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos de rentabilidad"}
            </p>
            <Form.Check
              type="checkbox"
              label="Mostrar listado de gastos"
              className="mb-3"
              checked={mostrarGastos}
              onChange={() => setMostrarGastos((prev) => !prev)}
            />

            {/* LISTADO DE GASTOS */}
            {mostrarGastos && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>F. Gasto</th>
                    <th>Usu</th>
                    <th>Tipo</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>Visa</th>
                    <th>Pagado</th>
                    <th>Cant.</th>
                    <th>Importe Uni.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosObra.length > 0 ? (
                    gastosObra.map((gasto, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(gasto.fecha_gasto).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{gasto.usuario_alta}</td>
                        <td>{gasto.tipo_gasto}</td>
                        <td>{gasto.fecha_validacion}</td>
                        <td>{gasto.usuario_validacion}</td>
                        <td>{gasto.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>{gasto.fecha_pago}</td>
                        <td>{gasto.cantidad}</td>
                        <td>{gasto.importe}</td>
                        <td>{gasto.importe * gasto.cantidad}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay gastos asociados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div className="mt-3">
              <strong>Totales Gastos Generales</strong>
              {tiposGastos.length > 0 ? (
                tiposGastos.map((gasto, idx) => (
                  <p key={idx}>{`${gasto.tipo}: ${gasto.importe}`}</p>
                ))
              ) : (
                <p>No hay gastos asociados</p>
              )}
              <p>
                <strong>Total Importe Gastos:</strong>
                {totalImporteGastos.toFixed(2)}
              </p>
            </div>

            {/* Gastos de Almacen*/}
            <h5 className="mt-4">Gastos Generales</h5>

            <div className="mt-3">
              <strong>Totales Almacen</strong>
              <p>
                Total Importe Almacen:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastos_almacen ?? 0
                  : "No hay datos de rentabilidad"}
              </p>
            </div>

            {/* Gastos de Compras */}
            <h5 className="mt-4">Gastos de Compras</h5>

            <div className="mt-3">
              <strong>Totales Compras</strong>
              <p>
                Total Importe Compras:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastos_compras ?? 0
                  : "No hay datos de rentabilidad"}
              </p>
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
              checked={mostrarHorasHijas}
              onChange={() => setMostrarHorasHijas((prev) => !prev)}
            />

            {/* LISTADO DE HORAS SUBORDINADAS */}
            {mostrarHorasHijas && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Dia Trab.</th>
                    <th>Usu</th>
                    <th>Tarea</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>hrs.</th>
                    <th>p.h.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {horasObrasHijas.length > 0 ? (
                    horasObrasHijas.map((hora, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(hora.dia_trabajado).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario}</td>
                        <td>{hora.id_tarea}</td>
                        <td>
                          {new Date(hora.fecha_validacion).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario_validacion}</td>
                        <td>{hora.num_horas}</td>
                        <td>{hora.precio_hora}</td>
                        <td>{hora.num_horas * hora.precio_hora}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        No hay horas asociadas a las obras subordinadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div className="mt-3">
              <strong>Totales Horas</strong>
              <p>Total Importe Horas Obras Subordinadas: Por incluir</p>
            </div>

            {/* Horas Extras de las Obras Subordinadas */}
            <h5 className="mt-4">Horas Extras de la Obra</h5>
            {/* LISTADO DE HORAS EXTRA*/}
            {mostrarHorasHijas && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Dia Trab.</th>
                    <th>Usu</th>
                    <th>Tipo</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>Visa</th>
                    <th>Pagado</th>
                    <th>Cant.</th>
                    <th>i.u.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {horasExtraObrasHijas.length > 0 ? (
                    horasExtraObrasHijas.map((hora, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(hora.fecha_gasto).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario}</td>
                        <td>{hora.descripcion}</td>
                        <td>
                          {new Date(hora.fecha_validacion).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.usuario_validacion}</td>
                        <td>{hora.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>
                          {new Date(hora.fecha_pago).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{hora.cantidad}</td>
                        <td>{hora.importe}</td>
                        <td>{hora.cantidad * hora.importe}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        No hay horas extras asociadas a las obras subordinadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
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
              checked={mostrarGastosHijas}
              onChange={() => setMostrarGastosHijas((prev) => !prev)}
            />

            {/* LISTADO DE GASTOS DE OBRAS SUBORDINADAS*/}
            {mostrarGastosHijas && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>F. Gasto</th>
                    <th>Usu</th>
                    <th>Tipo</th>
                    <th>Validado</th>
                    <th>UsuV</th>
                    <th>Visa</th>
                    <th>Pagado</th>
                    <th>Cant.</th>
                    <th>Importe Uni.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosObrasHijas.length > 0 ? (
                    gastosObrasHijas.map((gasto, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(gasto.fecha_gasto).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{gasto.usuario_alta}</td>
                        <td>{gasto.tipo_gasto}</td>
                        <td>{gasto.fecha_validacion}</td>
                        <td>{gasto.usuario_validacion}</td>
                        <td>{gasto.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>{gasto.fecha_pago}</td>
                        <td>{gasto.cantidad}</td>
                        <td>{gasto.importe}</td>
                        <td>{gasto.importe * gasto.cantidad}</td>
                        <td>
                          <Button variant="info" className="me-2">
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        No hay gastos asociados a las obras subordinadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div className="mt-3">
              <strong>Totales Gastos Generales</strong>
              {tiposGastosHijas.length > 0 ? (
                tiposGastosHijas.map((gasto, idx) => (
                  <p key={idx}>{`${gasto.tipo}: ${gasto.importe}`}</p>
                ))
              ) : (
                <p>No hay gastos asociados</p>
              )}
              <p>
                <strong>Total Importe Gastos:</strong>
                {"Por incluir"}
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
                <strong>H.Previstas</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.horas_previstas
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>H. Reales</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.horasReal
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Gasto Personal (GP)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastoPersonal
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>H. Totales</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.horasTotal
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>G.Personal Total (GP + GHE)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastoPersonalTotal ?? "Sin especificar"
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>H.Extra</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.horasExtra
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Gasto H.Extra (GHE)</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.gastoPersonalExtra ?? "Sin especificar"
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Gasto Prev</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gasto_previsto
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>G.Real (GR)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastoReal
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>G.Almacen (GA)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastos_almacen ?? 0
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>G.Compras (GC)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastos_compras ?? 0
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Importe</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.importe
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Sum P</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.sumPedido
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Sum F</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.sumFactura
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Pte P</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.ptePedido
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Pte F</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.pteFactura
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>G.Total (GP + GR + GHE + GA + GC)</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.gastoPersonal +
                    rentabilidadObra.gastoReal +
                    rentabilidadObra.gastoPersonalExtra
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>Rentabilidad</strong>:{" "}
                {rentabilidadObra
                  ? rentabilidadObra.rentabilidad
                  : "No hay datos de rentabilidad"}
              </p>
              <p>
                <strong>%Rent</strong>:
                {rentabilidadObra
                  ? rentabilidadObra.rentabilidadPorcentaje
                  : "No hay datos de rentabilidad"}
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
