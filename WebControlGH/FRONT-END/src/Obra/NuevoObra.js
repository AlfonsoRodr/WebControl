import React, { useEffect, useState } from "react"; // Importa React y el hook useState
import { Form, Button, Col, Row, Container, ListGroup } from "react-bootstrap"; // Importa componentes de Bootstrap
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para la navegación
import "../css/NuevoObra.css"; // Importa los estilos específicos de NuevoObra
import axios from "axios";

// Componente NuevoObra
const NuevoObra = () => {
  //------------------------ HOOKS --------------------- \\

  const navigate = useNavigate(); // Hook para la navegación

  //------------------------ ESTADOS --------------------- \\

  //#region ESTADOS PARA LOS DESPLEGABLES

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

  //#endregion

  //#region FORM DE LA OBRA
  const [formObra, setFormObra] = useState({
    cod: "",
    desc: "",
    fechaSeg: "",
    descSeg: "",
    tipoObra: "",
    facturable: "",
    estadoObra: "",
    fechaAlta: "",
    usuarioAlta: "",
    fechaFin: "",
    fechaOferta: "",
    horasPrevistas: 0,
    gastoPrevisto: 0,
    importe: 0,
    viabilidad: 100,
    empresa: "",
    contacto: "",
    edificio: "",
    observaciones: "",
    observacionesInternas: "",
  }); // Define el estado inicial de la obra

  //#endregion

  //#region OFERTADO Y EN SEGUIMIENTO

  const [ofertado, setOfertado] = useState(false);
  const [enSeguimiento, setEnSeguimiento] = useState(false);

  //#endregion

  //#region ESTADOS PARA LA BUSQUEDA/SELECCIÓN/ELIMINACIÓN DE OBRAS RELACIONADAS

  const [obraPadreBusqueda, setObraPadreBusqueda] = useState("");
  const [sugerenciasPadre, setSugerenciasPadre] = useState([]);
  const [obraPadreSeleccionada, setObraPadreSeleccionada] = useState(null);

  const [obraHijaBusqueda, setObraHijaBusqueda] = useState("");
  const [sugerenciasHijas, setSugerenciasHijas] = useState([]);
  const [obrasHijasSeleccionadas, setObrasHijasSeleccionadas] = useState([]);

  //#endregion

  //------------------------ FETCH DE DATOS --------------------- \\

  //#region

  const fetchDatosDesplegables = async () => {
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
      const contactos = await axios.get(`http://localhost:3002/api/contacto`);
      setAllContactosEmpresa(contactos.data.data);
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

  //#endregion

  //------------------------ USE EFFECT --------------------- \\

  useEffect(() => {
    fetchDatosDesplegables();
  }, []);

  //------------------------ HANDLERS --------------------- \\

  //#region CAMBIOS EN EL FORMULARIO

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; // Extrae propiedades del evento
    const camposNumericos = [
      "tipoObra",
      "facturable",
      "estadoObra",
      "usuarioAlta",
      "horasPrevistas",
      "gastoPrevisto",
      "importe",
      "viabilidad",
      "empresa",
      "contacto",
      "edificio",
    ];

    setFormObra((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name) ? Number(value) : value,
    }));

    // Cada vez que cambiamos la empresa, debemos hacer un fetch de los contactos
    // asociados a dicha empresa
    if (name === "empresa") {
      fetchContactosEmpresa(value);
    }
  };

  //#endregion

  //#region SUBMIT DEL FORMULARIO

  const handleGuardarRelacionPadre = async (idObraHija) => {
    const endpoint = "http://localhost:3002/api/relacion-obras/padre";
    try {
      const idObraPadre = obraPadreSeleccionada
        ? obraPadreSeleccionada.id_obra
        : null;
      await axios.post(endpoint, { idObraPadre, idObraHija });
    } catch (error) {
      console.error(`Error al establecer la obra padre - ${error}`);
    }
  };

  const handleGuardarRelacionHijas = async (idObraPadre) => {
    const endpoint = "http://localhost:3002/api/relacion-obras/hijas";
    try {
      const idsObrasHijas =
        obrasHijasSeleccionadas.length > 0
          ? obrasHijasSeleccionadas.map((obra) => obra.id_obra)
          : [];
      await axios.post(endpoint, { idObraPadre, idsObrasHijas });
    } catch (error) {
      console.error(`Error al establecer las obras hijas - ${error}`);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formObra);

    try {
      const nuevaObra = await axios.post(
        "http://localhost:3002/api/obra",
        formObra
      );
      console.log(nuevaObra.data.data);
      handleGuardarRelacionPadre(nuevaObra.data.data.id_obra);
      handleGuardarRelacionHijas(nuevaObra.data.data.id_obra);
      alert("Obra guardada con éxito");
      navigate("/home/gestion-obras"); // Redirige a la página de gestión de obras después de crear la obra
    } catch (error) {
      console.error(`Error al guardar la obra - ${error}`);
      alert("Error al guardar la obra");
    }
  };

  //#endregion

  //#region CANCELAR

  // Función para manejar la cancelación de la creación de obra
  const handleCancel = () => {
    navigate("/home/gestion-obras"); // Redirige a la página de gestión de obras al cancelar
  };

  //#endregion

  //#region CHECK DE OFERTADO y EN SEGUIMIENTO

  const handleChangeOfertado = () => {
    setOfertado(() => {
      const nuevoValor = !ofertado;

      if (!nuevoValor) {
        setFormObra((prev) => ({
          ...prev,
          fechaOferta: null,
        }));
      }
      return nuevoValor;
    });
  };

  const handleChangeSeguimiento = () => {
    setEnSeguimiento(() => {
      const nuevoValor = !enSeguimiento;

      if (!nuevoValor) {
        setFormObra((prev) => ({
          ...prev,
          fechaSeg: null,
          descSeg: null,
        }));
      }
      return nuevoValor;
    });
  };

  //#endregion

  //#region HANDLERS PARA BUSQUEDA/SELECCION/ELIMINACION DE OBRAS RELACIONADAS

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
    setObraPadreSeleccionada(obra);
    setObraPadreBusqueda("");
    setSugerenciasPadre([]);
  };

  const eliminarObraPadre = () => {
    setObraPadreSeleccionada(null);
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
    if (!obrasHijasSeleccionadas.some((o) => o.id_obra === obra.id_obra)) {
      setObrasHijasSeleccionadas([...obrasHijasSeleccionadas, obra]);
    }
    setObraHijaBusqueda("");
    setSugerenciasHijas([]);
  };

  const eliminarObraHija = (idObra) => {
    setObrasHijasSeleccionadas(
      obrasHijasSeleccionadas.filter((o) => o.id_obra !== idObra)
    );
  };

  //#endregion

  //------------------------ JSX --------------------- \\

  //#region

  return (
    <Container className="nuevo-obra-container">
      <div className="nuevo-obra">
        <h2>Editor de Obra</h2>
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Editor de Obra</legend>
            <Form.Group as={Row} controlId="cod">
              <Form.Label column sm="2">
                <strong>Código:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="cod"
                  value={formObra.cod}
                  onChange={handleChange}
                  placeholder="código de obra"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="descripcion">
              <Form.Label column sm="2">
                <strong>Descripción</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="desc"
                  value={formObra.desc}
                  onChange={handleChange}
                  placeholder="descripción de obra"
                />
              </Col>
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="En Seguimiento"
              checked={enSeguimiento}
              onChange={handleChangeSeguimiento}
              className="mt-3"
            />

            {enSeguimiento && (
              <>
                <Form.Group as={Row} controlId="fSeg">
                  <Form.Label column sm="2">
                    Fecha Seguimiento:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="date"
                      name="fechaSeg"
                      value={formObra.fechaSeg}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="descripcionSeg">
                  <Form.Label column sm="2">
                    Motivo:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      name="descSeg"
                      value={formObra.descSeg}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
              </>
            )}

            <Form.Group controlId="relacioObras" className="mt-2">
              <Form.Label>
                <strong>Relación con otras obras:</strong>
              </Form.Label>
              <div>
                {/* Obra Padre */}
                <div className="mb-2 position-relative">
                  Depende de la obra:
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
                        Obra padre seleccionada:{" "}
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
                  Obras Subordinadas:
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
          </fieldset>

          <fieldset>
            <legend>Información General</legend>
            <Form.Group as={Row} controlId="tipo">
              <Form.Label column sm="2">
                <strong>Tipo de Obra:</strong>
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="tipoObra"
                  value={formObra.tipoObra}
                  onChange={handleChange}
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
                  name="facturable"
                  value={formObra.facturable}
                  onChange={handleChange}
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
                  value={formObra.estadoObra}
                  onChange={handleChange}
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
                  name="fechaAlta"
                  value={formObra.fechaAlta}
                  onChange={handleChange}
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
                  value={formObra.usuarioAlta}
                  onChange={handleChange}
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
                  name="fechaFin"
                  value={formObra.fechaFin}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <div className="d-flex align-items-center mt-3">
              <Form.Check
                type="checkbox"
                label="Ofertado:"
                checked={ofertado}
                onChange={handleChangeOfertado}
                className="me-3"
              />

              {ofertado && (
                <Form.Control
                  type="date"
                  name="fechaOferta"
                  value={formObra.fechaOferta}
                  onChange={handleChange}
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
                  value={formObra.horasPrevistas}
                  onChange={handleChange}
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
                  value={formObra.gastoPrevisto}
                  onChange={handleChange}
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
                  value={formObra.importe}
                  onChange={handleChange}
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
                  value={formObra.viabilidad}
                  onChange={handleChange}
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
                  value={formObra.empresa}
                  onChange={handleChange}
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
                  value={formObra.contacto}
                  onChange={handleChange}
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
                    <option>Cargando contactos...</option>
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
                  value={formObra.edificio}
                  onChange={handleChange}
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
                  value={formObra.observaciones}
                  onChange={handleChange}
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
                  value={formObra.observacionesInternas}
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

  //#endregion
};

export default NuevoObra; // Exporta el componente NuevoObra como predeterminado
