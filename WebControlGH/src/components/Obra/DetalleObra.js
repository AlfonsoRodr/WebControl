import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
  Accordion,
  ListGroup,
} from "react-bootstrap";
import axios, { all } from "axios";

const DetalleObra = () => {
  const { idObra } = useParams(); // Obtiene el código de la obra desde la URL
  const navigate = useNavigate();

  // ------------- ESTADOS PARA EL FORMULARIO ---------- \\

  // Para mostrar todos los tipos de obra
  const [allTiposObra, setAllTiposObra] = useState([]);
  // Para mostrar los tipos facturables
  const [allTiposFacturables, setAllTiposFacturables] = useState([]);
  // Para mostrar los estados de la obra
  const [allEstadosObra, setAllEstadosObra] = useState([]);
  // Para mostrar todos los usuarios
  const [allUsuarios, setAllUsuarios] = useState([]);
  // Para mostrar todas las empresas
  const [allEmpresas, setAllEmpresas] = useState([]);
  // Para mostrar todos los contactos de una empresa
  const [allContactosEmpresa, setAllContactosEmpresa] = useState([]);
  // Para mostrar los edificios
  const [allEdificios, setAllEdificios] = useState([]);

  // ------------- ESTADOS DE LA OBRA ------------------ \\

  // Definir el estado para el checkbox "En Seguimiento"
  const [enSeguimiento, setEnSeguimiento] = useState(false);
  // Definir el estado para el checkbox "Ofertado"
  const [ofertado, setOfertado] = useState(false);
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
      fetchContactosEmpresa(res.data.data[0].id_empresa);
      setEnSeguimiento(res.data.data[0].fecha_seg ? true : false);
      setOfertado(res.data.data[0].fecha_oferta ? true : false);
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
    try {
      const res = await axios.post(endpoint, { idsObra });
      setHorasExtraObrasHijas(res.data.data);
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
      // IDs de las obras hijas
      const idsObrasHijas = res.data.data.map(
        (obraHija) => obraHija.id_obraHija
      );
      fetchGastosHijas(idsObrasHijas);
      fetchHorasHijas(idsObrasHijas);
      fetchHorasExtraHijas(idsObrasHijas);
    } catch (error) {
      console.error(`Error al obtener las obras hijas - ${error}`);
    }
  };

  const fetchDatosFormulario = async () => {
    try {
      const tiposObra = await axios.get(`http://localhost:3002/api/tipo-obra`);
      setAllTiposObra(tiposObra.data.data);
      const tiposFacturable = await axios.get(
        `http://localhost:3002/api/tipo-facturable`
      );
      setAllTiposFacturables(tiposFacturable.data.data);
      const estadosObra = await axios.get(
        `http://localhost:3002/api/estado-obra`
      );
      setAllEstadosObra(estadosObra.data.data);
      const usuarios = await axios.get(`http://localhost:3002/api/usuario`);
      setAllUsuarios(usuarios.data.data);
      const empresas = await axios.get(`http://localhost:3002/api/empresa`);
      setAllEmpresas(empresas.data.data);
      const edificios = await axios.get(`http://localhost:3002/api/edificio`);
      setAllEdificios(edificios.data.data);
    } catch (error) {
      console.error(`Error al obtener los datos del formulario - ${error}`);
    }
  };

  const fetchContactosEmpresa = async (idEmpresa) => {
    try {
      const res = await axios.get(
        `http://localhost:3002/api/contacto/${idEmpresa}`
      );
      setAllContactosEmpresa(res.data.data);
    } catch (error) {
      console.error(`Error al obtener los contactos de la empresa - ${error}`);
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
    fetchDatosFormulario();
  }, []);

  if (!filteredObra) {
    return <h2>Obra no encontrada</h2>;
  }

  // ----------------------------- HANDLERS y FUNCIONES AUXILIARES ----------------------- \\

  // Función para eliminar un pedido
  const handleDeletePedido = (codigoPedido) => {};

  // Función para eliminar una factura
  const handleDeleteFactura = (codigoFactura) => {};

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
    const value = e.target.value;
    setObraPadreBusqueda(value);
    if (value.length > 2) {
      try {
        const endpoint = `http://localhost:3002/api/obra/buscar/descripcion?descripcionObra=${value}`;
        const res = await axios.get(endpoint);
        setSugerenciasPadre(res.data.data);
      } catch (error) {
        console.error(`Error al buscar obras - ${error}`);
      }
    } else {
      setSugerenciasPadre([]);
    }
  };

  const seleccionarObraPadre = (obra) => {
    console.log("Seleccionando...");
  };

  const eliminarObraPadre = () => {
    console.log("Eliminando...");
  };

  const handleObraHijaBusqueda = async (e) => {
    const value = e.target.value;
    setObraHijaBusqueda(value);
    if (value.length > 2) {
      try {
        const endpoint = `http://localhost:3002/api/obra/buscar/descripcion?descripcionObra=${value}`;
        const res = await axios.get(endpoint);
        setSugerenciasHijas(res.data.data);
      } catch (error) {
        console.error(`Error al obtener las obras - ${error}`);
      }
    } else {
      setSugerenciasHijas([]);
    }
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
            readOnly
            className="mt-3"
          />

          {enSeguimiento && (
            <>
              <Form.Group as={Row} controlId="fSeg">
                <Form.Label column sm="2">
                  <strong>Fecha Seguimiento:</strong>
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="date"
                    name="fSeg"
                    value={
                      filteredObra.fecha_seg
                        ? new Date(filteredObra.fecha_seg)
                            .toISOString()
                            .slice(0, 10)
                        : ""
                    }
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="descripcionSeg">
                <Form.Label column sm="2">
                  <strong>Motivo:</strong>
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    name="descripcionSeg"
                    value={filteredObra.descripcion_seg || "Sin descripción"}
                    readOnly
                  />
                </Col>
              </Form.Group>
            </>
          )}

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
            <Form.Group as={Row} controlId="tipoObra">
              <Form.Label column sm="2">
                <strong>Tipo de Obra:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="tipoObra"
                  value={filteredObra.tipo_obra || ""}
                  readOnly
                >
                  {allTiposObra.length > 0 ? (
                    allTiposObra.map((tipo) => (
                      <option key={tipo.id_tipo} value={tipo.id_tipo}>
                        {tipo.descripcion}
                      </option>
                    ))
                  ) : (
                    <option>Cargando tipos de obra...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="tipoFacturable">
              <Form.Label column sm="2">
                <strong>Facturable:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="tipoFacturable"
                  value={filteredObra.facturable || ""}
                  readOnly
                >
                  {allTiposFacturables.length > 0 ? (
                    allTiposFacturables.map((tipo) => (
                      <option key={tipo.id_tipo} value={tipo.id_tipo}>
                        {tipo.descripcion}
                      </option>
                    ))
                  ) : (
                    <option>Cargando tipos facturables...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="estadoObra">
              <Form.Label column sm="2">
                <strong>Estado:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="estadoObra"
                  value={filteredObra.estado_obra || ""}
                  readOnly
                >
                  {allEstadosObra.length > 0 ? (
                    allEstadosObra.map((estado) => (
                      <option
                        key={estado.codigo_estado}
                        value={estado.codigo_estado}
                      >
                        {estado.descripcion_estado}
                      </option>
                    ))
                  ) : (
                    <option>Cargando estados de obra...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fAlta">
              <Form.Label column sm="2">
                <strong>Fecha de Alta:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fAlta"
                  value={
                    filteredObra.fecha_alta
                      ? new Date(filteredObra.fecha_alta)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="usuarioAlta">
              <Form.Label column sm="2">
                <strong>Usuario Alta:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="usuarioAlta"
                  value={filteredObra.codigo_usuario_alta || ""}
                  readOnly
                >
                  {allUsuarios.length > 0 ? (
                    allUsuarios.map((usuario) => (
                      <option
                        key={usuario.codigo_usuario}
                        value={usuario.codigo_usuario}
                      >
                        {`(${usuario.codigo_firma}) ${usuario.nombre || ""} ${
                          usuario.apellido1 || ""
                        } ${usuario.apellido2 || ""}`}
                      </option>
                    ))
                  ) : (
                    <option>Cargando usuarios...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="fFin">
              <Form.Label column sm="2">
                <strong>Fecha Prevista:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="fFin"
                  value={
                    filteredObra.fecha_prevista_fin
                      ? new Date(filteredObra.fecha_prevista_fin)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  readOnly
                />
              </Col>
            </Form.Group>

            <div className="d-flex align-items-center mt-3">
              <Form.Check
                type="checkbox"
                label="Ofertado:"
                checked={ofertado}
                readOnly
                className="me-3"
              />

              {ofertado && (
                <Form.Control
                  type="date"
                  name="fOferta"
                  value={
                    filteredObra.fecha_oferta
                      ? new Date(filteredObra.fecha_oferta)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  readOnly
                />
              )}
            </div>

            <Form.Group as={Row} controlId="horasPrevistas">
              <Form.Label column sm="2">
                <strong>Horas Previstas:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="horasPrevistas"
                  value={filteredObra.horas_previstas || 0}
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="gastoPrevisto">
              <Form.Label column sm="2">
                <strong>Gasto Previsto:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="gastoPrevisto"
                  value={filteredObra.gasto_previsto || 0}
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="importe">
              <Form.Label column sm="2">
                <strong>Importe:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="importe"
                  value={filteredObra.importe || 0}
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="viabilidad">
              <Form.Label column sm="2">
                <strong>Viabilidad:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  name="viabilidad"
                  value={filteredObra.viabilidad || 0}
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="empresa">
              <Form.Label column sm="2">
                <strong>Empresa:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="empresa"
                  value={filteredObra.id_empresa || ""}
                  readOnly
                >
                  {allEmpresas.length > 0 ? (
                    allEmpresas.map((empresa) => (
                      <option
                        key={empresa.id_empresa}
                        value={empresa.id_empresa}
                      >
                        {empresa.nombre}
                      </option>
                    ))
                  ) : (
                    <option>Cargando empresas...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="contacto">
              <Form.Label column sm="2">
                <strong>Contacto:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="contacto"
                  value={filteredObra.id_contacto || ""}
                  readOnly
                >
                  {allContactosEmpresa.length > 0 ? (
                    allContactosEmpresa.map((contacto) => (
                      <option
                        key={contacto.id_contacto}
                        value={contacto.id_contacto}
                      >
                        {`${contacto.nombre_contacto} ${contacto.apellido1} ${contacto.apellido2}`}
                      </option>
                    ))
                  ) : (
                    <option>Cargando empresas...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="edificio">
              <Form.Label column sm="2">
                <strong>Complejo:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="edificio"
                  value={filteredObra.id_edificio || ""}
                  readOnly
                >
                  {allEdificios.length > 0 ? (
                    allEdificios.map((edificio) => (
                      <option
                        key={edificio.id_edificio}
                        value={edificio.id_edificio}
                      >
                        {edificio.nombre}
                      </option>
                    ))
                  ) : (
                    <option>Cargando complejos...</option>
                  )}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="observaciones">
              <Form.Label column sm="2">
                <strong>Observaciones:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="observaciones"
                  value={filteredObra.observaciones || "Sin observaciones"}
                  readOnly
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="observacionesInternas">
              <Form.Label column sm="2">
                <strong>Observaciones Internas:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="observacionesInternas"
                  value={
                    filteredObra.observaciones_internas || "Sin observaciones"
                  }
                  readOnly
                />
              </Col>
            </Form.Group>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosObra.length > 0 ? (
                  pedidosObra.map((pedido, index) => (
                    <tr key={index}>
                      <td>{pedido.codigo_pedido}</td>
                      <td>
                        {new Date(pedido.fecha).toLocaleDateString("es-Es")}
                      </td>
                      <td>{pedido.importe}</td>
                      <td>
                        {rentabilidadObra
                          ? (rentabilidadObra.ptePedido /
                              rentabilidadObra.pteObra) *
                            100
                          : "No hay datos de rentabilidad"}
                      </td>{" "}
                      <td>
                        <p>
                          <Button variant="info" size="sm" className="me-2">
                            Detalle
                          </Button>
                        </p>
                        <p>
                          <Button variant="danger" size="sm">
                            Eliminar
                          </Button>
                        </p>
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
                      <td>
                        <p>
                          <Button variant="info" size="sm" className="me-2">
                            Detalle
                          </Button>
                        </p>
                        <p>
                          <Button variant="danger" size="sm">
                            Eliminar
                          </Button>
                        </p>
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
                        <td>
                          {new Date(gasto.fecha_validacion).toLocaleDateString(
                            "es-Es"
                          )}
                        </td>
                        <td>{gasto.usuario_validacion}</td>
                        <td>{gasto.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>
                          {new Date(gasto.fecha_pago).toLocaleDateString(
                            "es-Es"
                          )}
                        </td>
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
                        <td>
                          {new Date(gasto.fecha_validacion).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{gasto.usuario_validacion}</td>
                        <td>{gasto.pagado_visa ? "[SÍ]" : "[NO]"}</td>
                        <td>
                          {new Date(gasto.fecha_pago).toLocaleDateString(
                            "es-Es"
                          )}
                        </td>
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
