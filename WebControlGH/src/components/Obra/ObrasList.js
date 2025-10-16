import React, { useState, useEffect } from "react"; // Importa React y hooks de React
import {
  Table,
  Button,
  Alert,
  FormControl,
  InputGroup,
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Accordion,
} from "react-bootstrap"; // Importa componentes de Bootstrap
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para la navegación
import "../../css/ObrasList.css"; // Importa los estilos específicos de ObrasList
import axios from "axios";

// Componente ObrasList
const ObrasList = () => {
  // ------------------- ESTADOS ------------------- \\

  //#region ESTADOS PARA MOSTRAR UN MENSAJE DE CARGA Y POSIBLE ERROR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //#endregion

  //#region ESTADOS PARA LA BUSQUEDA/SELECCIÓN DE OBRAS
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredObras, setFilteredObras] = useState([]); // Estado para las obras filtradas
  const [selectedObras, setSelectedObras] = useState([]); // Estado para las obras seleccionadas
  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox de seleccionar todo
  const [allObras, setAllObras] = useState([]);
  //#endregion

  //#region ESTADOS PARA LAS OBRAS CON REQUISITOS
  const [obrasSuperadas, setObrasSuperadas] = useState([]); // Estado para las obras superadas
  const [obrasFacturadas, setObrasFacturadas] = useState([]); // Estado para las obras facturadas
  const [obrasSeguimiento, setObrasSeguimiento] = useState([]); // Estado para las obras en seguimiento
  const [obrasSinPedidosConHoras, setObrasSinPedidoConHoras] = useState([]); // Estado para las obras con horas pero sin pedidos
  //#endregion

  //#region ESTADOS PARA LA SELECCIÓN DE OBRAS CON REQUISITOS
  const [obraSuperadaSelec, setObraSuperadaSelec] = useState(null);
  const [obraFacturadaSelec, setObraFacturadaSelec] = useState(null);
  const [obrasSeguimientoSelec, setObraSeguimientoSelec] = useState(null);
  const [obraSinPedidosConHorasSelec, setObraSinPedidosConHorasSelec] =
    useState(null);
  //#endregion

  //#region ESTADO PARA EL FORM DE BÚSQUEDA
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    complejo: "",
    empresa: "",
    enSeguimiento: "",
    estadoObra: "",
    tipoObra: "",
    ofertada: "",
    conPedido: "",
    conFactura: "",
    conHoras: "",
    conGastos: "",
    relacionEntreObras: "",
    obrasDadasDeBaja: false,
  });
  //#endregion

  //#region ESTADOS PARA LOS DESPLEGABLES
  const [allTiposObra, setAllTiposObra] = useState([]);
  const [allEstadosObra, setAllEstadosObra] = useState([]);
  const [allEmpresas, setAllEmpresas] = useState([]);
  const [allEdificios, setAllEdificios] = useState([]);
  //#endregion

  //#region ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  //#endregion

  // ------------------- HOOKS ------------------- \\

  const navigate = useNavigate(); // Hook para la navegación

  // ------------------- FETCH DE DATOS ------------------- \\

  //#region
  // Funcion que hace fetch de todas las obras y las almacena en la variable allObras.
  const fetchObras = async () => {
    try {
      const endpoint = "http://localhost:3002/api/obra";
      const response = await axios.get(endpoint);
      // Response.data tiene success y data. Hay que acceder a data.data para los datos.
      setAllObras(response.data.data);
      setFilteredObras(response.data.data);
      countObrasSuperadas(response.data.data);
      countObrasFacturadas(response.data.data);
      countObrasSeguimiento(response.data.data);
      countObrasConHorasSinPedidos(response.data.data);
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${
            error.response.data.error ||
            "Error al cargar los detalles de las obras."
          }`
        );
      } else if (error.request) {
        setError("Error en la solicitud al servidor.");
      } else {
        setError("Error desconocido al cargar los detalles de las obras");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDatosDesplegables = async () => {
    try {
      const tiposObra = await axios.get(`http://localhost:3002/api/tipo-obra`);
      setAllTiposObra(tiposObra.data.data);
      const estadosObra = await axios.get(
        `http://localhost:3002/api/estado-obra`
      );
      setAllEstadosObra(estadosObra.data.data);
      const empresas = await axios.get(`http://localhost:3002/api/empresa`);
      setAllEmpresas(empresas.data.data);
      const edificios = await axios.get(`http://localhost:3002/api/edificio`);
      setAllEdificios(edificios.data.data);
    } catch (error) {
      console.error(
        `Error al obtener los datos de los desplegables - ${error}`
      );
    }
  };
  //#endregion

  // ------------------- USE EFFECT ------------------- \\

  // Efecto para inicializar las obras filtradas y los conteos
  useEffect(() => {
    fetchObras();
    fetchDatosDesplegables();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // ------------------- HANDLERS Y FUNCIONES AUXILIARES ------------------- \\

  //#region HANDLER PARA EL FORMULARIO DE BÚSQUEDA
  const handleChangeForm = (e) => {
    if (e.target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
  //#endregion

  //#region HANDLER PARA FINALIZAR UNA OBRA
  const handleFinalizarObra = async (idObra) => {
    const update = { estadoObra: 4 }; // Corresponde con el estado Finalizada (No debería estar hardcodeado)
    const endpoint = `http://localhost:3002/api/obra/${idObra}`;
    try {
      await axios.put(endpoint, update);
      fetchObras();
      setObraFacturadaSelec(null);
    } catch (error) {
      console.error(`Error al finalizar la obra - ${error}`);
    }
  };
  //#endregion

  //#region HANDLER PARA LAS BÚSQUEDAS DE OBRAS
  const handleSearch = () => {
    let filtered = allObras;

    if (formData.fechaInicio) {
      filtered = filtered.filter(
        (obra) => new Date(obra.fecha_alta) >= new Date(formData.fechaInicio)
      );
    }

    if (formData.fechaFin) {
      filtered = filtered.filter(
        (obra) => new Date(obra.fecha_alta) <= new Date(formData.fechaFin)
      );
    }

    if (formData.complejo) {
      filtered = filtered.filter(
        (obra) => obra.nombre_edificio === formData.complejo
      );
    }

    if (formData.empresa) {
      filtered = filtered.filter(
        (obra) => obra.nombre_empresa === formData.empresa
      );
    }

    if (formData.enSeguimiento) {
      if (formData.enSeguimiento === "Si") {
        filtered = filtered.filter((obra) => obra.fecha_seg !== null);
      } else {
        filtered = filtered.filter((obra) => obra.fecha_seg === null);
      }
    }

    if (formData.estadoObra) {
      filtered = filtered.filter(
        (obra) => obra.desc_estado_obra === formData.estadoObra
      );
    }

    if (formData.tipoObra) {
      filtered = filtered.filter(
        (obra) => obra.desc_tipo_obra === formData.tipoObra
      );
    }

    if (formData.ofertada) {
      if (formData.ofertada === "Si") {
        filtered = filtered.filter((obra) => obra.fecha_oferta !== null);
      } else {
        filtered = filtered.filter((obra) => obra.fecha_oferta === null);
      }
    }

    if (formData.conPedido) {
      if (formData.conPedido === "Si") {
        filtered = filtered.filter((obra) => obra.total_pedidos !== 0);
      } else {
        filtered = filtered.filter((obra) => obra.total_pedidos === 0);
      }
    }

    if (formData.conFactura) {
      if (formData.conFactura === "Si") {
        filtered = filtered.filter((obra) => obra.total_facturas !== 0);
      } else {
        filtered = filtered.filter((obra) => obra.total_facturas === 0);
      }
    }

    if (formData.conHoras) {
      if (formData.conHoras === "Si") {
        filtered = filtered.filter((obra) => obra.total_horas !== 0);
      } else {
        filtered = filtered.filter((obra) => obra.total_horas === 0);
      }
    }

    if (formData.conGastos) {
      if (formData.conGastos === "Si") {
        filtered = filtered.filter((obra) => obra.total_gastos !== 0);
      } else {
        filtered = filtered.filter((obra) => obra.total_gastos === 0);
      }
    }

    if (formData.relacionEntreObras) {
      switch (formData.relacionEntreObras) {
        case "mostrarHijas":
          filtered = filtered.filter((obra) => obra.obra_padre !== null);
          break;
        case "mostrarPadres":
          filtered = filtered.filter((obra) => obra.num_hijas !== 0);
          break;
        case "mostrarPadresHijas":
          filtered = filtered.filter(
            (obra) => obra.obra_padre !== null || obra.num_hijas !== 0
          );
          break;
        case "ocultarHijas":
          filtered = filtered.filter((obra) => obra.obra_padre === null);
          break;
        case "ocultarPadres":
          filtered = filtered.filter((obra) => obra.num_hijas === 0);
          break;
        case "ocultarPadresHijas":
          filtered = filtered.filter(
            (obra) => obra.obra_padre === null || obra.num_hijas === 0
          );
          break;
      }
    }

    if (formData.obrasDadasDeBaja) {
      filtered = filtered.filter((obra) => obra.fecha_baja !== null);
    }

    if (!formData.obrasDadasDeBaja) {
      filtered = filtered.filter((obra) => obra.fecha_baja === null);
    }

    if (searchTerm) {
      filtered = filtered.filter((obra) =>
        obra.codigo_obra.includes(searchTerm.toUpperCase())
      );
    }

    setFilteredObras(filtered);
    setCurrentPage(1);
  };
  //#endregion

  //#region FUNCIONES DE CONTEO DE OBRAS
  // Función para contar las obras confirmadas cuya horas imputadas superan las horas previstas
  const countObrasSuperadas = (obras) => {
    const superadas = obras.filter(
      (obra) =>
        obra.desc_estado_obra === "Confirmada" &&
        obra.horasTotal > obra.horas_previstas
    );
    setObrasSuperadas(superadas);
  };

  // Función para contar las obras confirmadas y totalmente facturadas hace más de 30 días
  const countObrasFacturadas = (obras) => {
    const facturadas = obras.filter((obra) => {
      if (
        obra.desc_estado_obra === "Confirmada" &&
        (obra.total_facturas / obra.importe) * 100 >= 100 &&
        (obra.total_pedidos / obra.importe) * 100 >= 100
      ) {
        const facturacionDate = new Date(obra.fecha_ultima_factura);
        const today = new Date();
        const diffTime = Math.abs(today - facturacionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 30;
      }
      return false;
    });
    setObrasFacturadas(facturadas);
  };

  // Función para contar las obras en seguimiento
  const countObrasSeguimiento = (obras) => {
    const enSeguimiento = obras.filter((obra) => obra.fecha_seg !== null);
    setObrasSeguimiento(enSeguimiento);
  };

  const countObrasConHorasSinPedidos = (obras) => {
    const sinPedidosConHoras = obras.filter(
      (obra) => obra.total_pedidos === 0 && obra.total_horas !== 0
    );
    setObrasSinPedidoConHoras(sinPedidosConHoras);
  };

  //#endregion

  //#region HANDLERS PARA LA SELECCIÓN DE OBRAS
  // Función para manejar la selección de una obra
  const handleSelectObra = (idObra) => {
    setSelectedObras((prevSelected) =>
      prevSelected.includes(idObra)
        ? prevSelected.filter((id) => id !== idObra)
        : [...prevSelected, idObra]
    );
  };

  // Función para manejar la selección de todas las obras
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedObras(filteredObras.map((obra) => obra.id_obra));
    } else {
      setSelectedObras([]);
    }
  };
  //#endregion

  //#region AGREGAR OBRA
  // Función para manejar la adición de una nueva obra
  const handleAgregarObra = () => {
    navigate("/home/nuevo-obra");
  };
  //#endregion

  //#region DAR DE BAJA OBRA
  const deleteObra = async (selectedObras) => {
    try {
      const deletePromises = Array.from(selectedObras).map(async (id) => {
        await axios.delete(`http://localhost:3002/api/obra/${id}`);
      });
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error(
        "Error al dar de baja las obras:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  // Función para manejar la baja de obras seleccionadas
  const handleBajaObras = async () => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para dar de baja");
      return;
    }
    if (
      window.confirm("¿Estás seguro de dar de baja las obras seleccionadas?")
    ) {
      try {
        const success = await deleteObra(selectedObras);
        if (success) {
          await fetchObras();
          setSelectedObras([]);
          alert("Obras dadas de baja correctamente");
        } else {
          alert("Error al dar de baja las obras seleccionadas");
        }
      } catch (error) {
        console.error(`Error en el proceso de dar de baja - ${error}`);
      }
    }
  };
  //#endregion

  //#region COPIAR OBRA (SOLO LA INFO GENERAL)

  const normalizarFecha = (fechaISO) => {
    if (!fechaISO) return null;
    const fecha = new Date(fechaISO);
    return fecha.toISOString().split("T")[0];
  };

  const copiarObra = async (selectedObras) => {
    try {
      const copyPromises = Array.from(selectedObras).map(async (id) => {
        const obra = allObras.filter((obra) => obra.id_obra === id)[0];
        const data = {
          cod: obra.codigo_obra,
          desc: obra.descripcion_obra,
          fechaSeg: normalizarFecha(obra.fecha_seg),
          descSeg: obra.descripcion_seg,
          tipoObra: obra.tipo_obra,
          facturable: obra.facturable,
          estadoObra: obra.estado_obra,
          fechaAlta: normalizarFecha(obra.fecha_alta),
          usuarioAlta: obra.codigo_usuario_alta,
          fechaFin: normalizarFecha(obra.fecha_prevista_fin),
          fechaOferta: normalizarFecha(obra.fecha_oferta),
          horasPrevistas: obra.horas_previstas,
          gastoPrevisto: obra.gasto_previsto,
          importe: obra.importe,
          viabilidad: obra.viabilidad,
          empresa: obra.id_empresa,
          contacto: obra.id_contacto,
          edificio: obra.id_edificio,
          observaciones: obra.observaciones,
          observacionesInternas: obra.observaciones_internas,
        };
        console.log(data);
        await axios.post("http://localhost:3002/api/obra", data);
      });
      await Promise.all(copyPromises);
      return true;
    } catch (error) {
      console.error(`Error al copiar las obras - ${error}`);
      return false;
    }
  };

  // Función para manejar la copia de obras seleccionadas
  const handleCopiarObras = async () => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para copiar.");
      return;
    }
    try {
      const success = await copiarObra(selectedObras);
      if (success) {
        await fetchObras();
        setSelectedObras([]);
        alert("Obras copiadas correctamente");
      } else {
        alert("Error al copiar las obras");
      }
    } catch (error) {
      console.error("Error en el proceso de copiado de obras", error);
    }
  };
  //#endregion

  //#region IMPRIMIR OBRA
  // Función para manejar la impresión de obras seleccionadas
  const handleImprimirObras = () => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para imprimir.");
      return;
    }
    console.log("Obras seleccionadas para imprimir:", selectedObras);
    navigate("/home/imprimir-obra", {
      state: { selectedObras: selectedObras },
    });
  };
  //#endregion

  // ------------------- PAGINACIÓN --------------------- \\

  //#region VARIABLES Y HANDLERS PARA PAGINACIÓN
  const obrasPorPagina = 10; // Cantidad de obras por página
  // Índices de inicio y fin de las obras a mostrar en la página actual
  const indexOfLastObra = currentPage * obrasPorPagina;
  const indexOfFirstObra = indexOfLastObra - obrasPorPagina;
  // Obras a mostrar en la página actual
  const obrasActuales = filteredObras.slice(indexOfFirstObra, indexOfLastObra);
  // Número total de páginas
  const totalPaginas = Math.ceil(filteredObras.length / obrasPorPagina);
  // Número máximo de páginas a mostrar en la paginación
  const maxPaginasVisibles = 10;

  // Calcular el rango de páginas a mostrar (1-10, 11-20, 21-30, ...)
  const startPage =
    Math.floor((currentPage - 1) / maxPaginasVisibles) * maxPaginasVisibles + 1;
  const endPage = Math.min(startPage + maxPaginasVisibles - 1, totalPaginas);

  const paginasVisibles = [];
  for (let i = startPage; i <= endPage; i++) {
    paginasVisibles.push(i);
  }

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //#endregion

  // ----------------------------- JSX -------------------------------------- \\

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="obras-list">
      <Alert variant="danger">
        Hay {obrasSuperadas.length} obras confirmadas cuyo número de horas
        imputadas supera las horas previstas.
        <Form.Select onChange={(e) => setObraSuperadaSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasSuperadas.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion_obra} - Gastos Generales:{" "}
              {obra.gastoGeneral} - Horas Previstas: {obra.horas_previstas} -
              Horas Imputadas: {obra.horasTotal}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obraSuperadaSelec}
          onClick={() =>
            navigate(`/home/gestion-obras/detalle/${obraSuperadaSelec}`)
          }
        >
          Ver Detalles
        </Button>
      </Alert>

      <Alert variant="success">
        Hay {obrasFacturadas.length} obras confirmadas, totalmente facturadas
        hace más de 30 días.
        <Form.Select onChange={(e) => setObraFacturadaSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasFacturadas.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion_obra} - Última Factura:{" "}
              {new Date(obra.fecha_ultima_factura).toLocaleDateString("es-ES")}
            </option>
          ))}
        </Form.Select>
        <div className="d-flex gap-2 mt-2">
          <Button
            className="custom-button"
            disabled={!obraFacturadaSelec}
            onClick={() =>
              navigate(`/home/gestion-obras/detalle/${obraFacturadaSelec}`)
            }
          >
            Ver Detalles
          </Button>
          <Button
            className="custom-button"
            onClick={() => handleFinalizarObra(obraFacturadaSelec)}
            disabled={!obraFacturadaSelec}
          >
            Finalizar
          </Button>
        </div>
      </Alert>

      <Alert variant="purple">
        Hay {obrasSeguimiento.length} obras en seguimiento.
        <Form.Select onChange={(e) => setObraSeguimientoSelec(e.target.value)}>
          <option value="">Seleccionar obra...</option>
          {obrasSeguimiento.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion} - Fecha de Seguimiento:{" "}
              {new Date(obra.fecha_seg).toLocaleDateString("es-ES")} - Motivo:{" "}
              {obra.descripcion_seg}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obrasSeguimientoSelec}
          onClick={() =>
            navigate(`/home/gestion-obras/detalle/${obrasSeguimientoSelec}`)
          }
        >
          Ver Detalles
        </Button>
      </Alert>

      <Alert variant="warning">
        Existen {obrasSinPedidosConHoras.length} obras sin pedido en las que se
        han imputado horas. Pulse para acceder a la lista
        <Form.Select
          onChange={(e) => setObraSinPedidosConHorasSelec(e.target.value)}
        >
          <option value="">Seleccionar obra...</option>
          {obrasSinPedidosConHoras.map((obra, index) => (
            <option key={index} value={obra.id_obra}>
              {obra.codigo_obra} - {obra.descripcion} - Horas totales:{" "}
              {obra.total_horas} - Importe pedidos: {obra.total_pedidos}
            </option>
          ))}
        </Form.Select>
        <Button
          className="custom-button mt-2"
          disabled={!obraSinPedidosConHorasSelec}
          onClick={() =>
            navigate(
              `/home/gestion-obras/detalle/${obraSinPedidosConHorasSelec}`
            )
          }
        >
          Ver Detalles
        </Button>
      </Alert>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Criterios de Búsqueda</Accordion.Header>
          <Accordion.Body>
            <div
              id="criterios-collapse"
              className="mb-4 p-3 border rounded"
              style={{ backgroundColor: "#e9f5ff" }}
            >
              <Form>
                <div className="row">
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Fecha Inicio
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleChangeForm}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Fecha Fin
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleChangeForm}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Complejo
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="complejo"
                        value={formData.complejo}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        {allEdificios.length > 0 ? (
                          allEdificios.map((edificio) => (
                            <option
                              key={edificio.id_edificio}
                              value={edificio.nombre}
                            >
                              {edificio.nombre}
                            </option>
                          ))
                        ) : (
                          <option>Cargando complejos...</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Empresa
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        {allEmpresas.length > 0 ? (
                          allEmpresas.map((empresa) => (
                            <option
                              key={empresa.id_empresa}
                              value={empresa.nombre}
                            >
                              {empresa.nombre}
                            </option>
                          ))
                        ) : (
                          <option>Cargando empresas...</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        En Seguimiento
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="enSeguimiento"
                        value={formData.enSeguimiento}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Estado de la obra
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="estadoObra"
                        value={formData.estadoObra}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        {allEstadosObra.length > 0 ? (
                          allEstadosObra.map((estado) => (
                            <option
                              key={estado.codigo_estado}
                              value={estado.descripcion_estado}
                            >
                              {estado.descripcion_estado}
                            </option>
                          ))
                        ) : (
                          <option>Cargando estados de obra...</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Tipo de obra
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="tipoObra"
                        value={formData.tipoObra}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        {allTiposObra.length > 0 ? (
                          allTiposObra.map((tipo) => (
                            <option key={tipo.id_tipo} value={tipo.descripcion}>
                              {tipo.descripcion}
                            </option>
                          ))
                        ) : (
                          <option>Cargando tipos de obra...</option>
                        )}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Obras ofertadas
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="ofertada"
                        value={formData.ofertada}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Obras con pedidos
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="conPedido"
                        value={formData.conPedido}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Obras con facturas
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="conFactura"
                        value={formData.conFactura}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Obras con horas
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="conHoras"
                        value={formData.conHoras}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Obras con gastos
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="conGastos"
                        value={formData.conGastos}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="Si">SÍ</option>
                        <option value="No">NO</option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label style={{ color: "black" }}>
                        Relación entre obras
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="relacionEntreObras"
                        value={formData.relacionEntreObras}
                        onChange={handleChangeForm}
                      >
                        <option value="">-</option>
                        <option value="mostrarHijas">
                          Mostrar solo obras hija
                        </option>
                        <option value="mostrarPadres">
                          Mostrar solo obras padre
                        </option>
                        <option value="mostrarPadresHijas">
                          Mostrar solo obras padre/hija
                        </option>
                        <option value="ocultarHijas">
                          Ocultar solo obras hija
                        </option>
                        <option value="ocultarPadres">
                          Ocultar solo obras padre
                        </option>
                        <option value="ocultarPadresHijas">
                          Ocultar obras padre/hija
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className="col-md-3">
                    <Form.Check
                      type="checkbox"
                      name="obrasDadasDeBaja"
                      label="Mostrar obras dadas de Baja"
                      checked={formData.obrasDadasDeBaja}
                      onChange={handleChangeForm}
                      className="mt-3"
                    />
                  </div>
                </div>
              </Form>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Container>
        <Row className="align-items-center mb-3">
          <Col md={8}>
            <InputGroup className="search-bar2">
              <FormControl
                placeholder="Código de obra"
                aria-label="Código de obra"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="custom-input" // Agrega la clase personalizada
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                className="custom-button2"
              >
                Buscar
              </Button>
            </InputGroup>
          </Col>
          <Col md={4} className="text-end">
            <Button onClick={handleAgregarObra} className="custom-button">
              Agregar Obra
            </Button>
            <Button onClick={handleBajaObras} className="custom-button">
              Baja Obras
            </Button>
            <Button onClick={handleCopiarObras} className="custom-button">
              Copiar Obras
            </Button>
            <Button onClick={handleImprimirObras} className="custom-button">
              Imprimir Obras
            </Button>
          </Col>
        </Row>
      </Container>

      <div
        className="table-container"
        style={{ overflowX: "auto", maxWidth: "100%" }}
      >
        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ width: "60px" }}>Cód.</th>
              <th style={{ minWidth: "150px", maxWidth: "200px" }}>
                Descripción
              </th>
              <th style={{ width: "80px" }}>Tipo</th>
              <th style={{ width: "90px" }}>Estado</th>
              <th style={{ minWidth: "100px", maxWidth: "120px" }}>Empresa</th>
              <th style={{ width: "150px" }}>F. Oferta</th>
              <th style={{ width: "50px" }}>R</th>
              <th style={{ width: "60px" }}>%P.</th>
              <th style={{ width: "60px" }}>%F.</th>
              <th style={{ width: "80px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {obrasActuales.length > 0 ? (
              obrasActuales.map((obra, index) => (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedObras.includes(obra.id_obra)}
                      onChange={() => handleSelectObra(obra.id_obra)}
                    />
                  </td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "100px" }}
                    title={obra.codigo_obra}
                  >
                    {obra.codigo_obra}
                  </td>
                  <td
                    className="text-truncate"
                    style={{ maxWidth: "150px" }}
                    title={obra.descripcion_obra}
                  >
                    {obra.descripcion_obra}
                  </td>
                  <td className="text-truncate" title={obra.desc_tipo_obra}>
                    {obra.desc_tipo_obra}
                  </td>
                  <td className="text-truncate" title={obra.desc_estado_obra}>
                    {obra.desc_estado_obra}
                  </td>
                  <td className="text-truncate" title={obra.nombre_empresa}>
                    {obra.nombre_empresa}
                  </td>
                  <td className="text-nowrap">
                    {obra.fecha_oferta
                      ? new Date(obra.fecha_oferta).toLocaleDateString("es-ES")
                      : "[No ofertada]"}
                  </td>
                  <td className="text-center">{`${
                    obra.rentabilidadPorcentaje ?? "-"
                  }%`}</td>
                  <td className="text-center">
                    {`${
                      obra.importe !== 0
                        ? Math.round((obra.total_pedidos / obra.importe) * 100)
                        : 0
                    }%`}
                  </td>
                  <td className="text-center">{`${
                    obra.importe !== 0
                      ? Math.round((obra.total_facturas / obra.importe) * 100)
                      : 0
                  }%`}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() =>
                        navigate(`/home/gestion-obras/detalle/${obra.id_obra}`)
                      }
                    >
                      Detalle
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  {loading
                    ? "Cargando detalles de las obras..."
                    : "No se encontraron obras"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {/* Paginación */}
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        {startPage > 1 && (
          <Pagination.Prev onClick={() => handlePageChange(startPage - 1)} />
        )}
        {paginasVisibles.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        {endPage < totalPaginas && (
          <Pagination.Next onClick={() => handlePageChange(endPage + 1)} />
        )}
        <Pagination.Last onClick={() => handlePageChange(totalPaginas)} />
      </Pagination>
    </div>
  );
};

export default ObrasList; // Exporta el componente ObrasList como predeterminado
