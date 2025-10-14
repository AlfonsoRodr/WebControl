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
} from "react-bootstrap"; // Importa componentes de Bootstrap
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para la navegación
import "../../css/ObrasList.css"; // Importa los estilos específicos de ObrasList
import axios from "axios";

// Componente ObrasList
const ObrasList = () => {
  // ------------------- ESTADOS ------------------- \\

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

  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

  // ------------------- HOOKS ------------------- \\

  const navigate = useNavigate(); // Hook para la navegación

  // ------------------- FETCH DE DATOS ------------------- \\

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
      console.error(`Error al recuperar las obras - ${error}`);
    }
  };

  // ------------------- USE EFFECT ------------------- \\

  // Efecto para inicializar las obras filtradas y los conteos
  useEffect(() => {
    fetchObras();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // ------------------- HANDLES Y FUNCIONES AUXILIARES ------------------- \\

  // Función para finalizar una obra
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

  // Función para manejar la búsqueda de obras
  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredObras(allObras);
    } else {
      const filtered = allObras.filter(
        (obra) => obra.codigo_obra === searchTerm.toUpperCase()
      );
      setFilteredObras(filtered);
      setCurrentPage(1);
    }
  };

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

  // Función para manejar la adición de una nueva obra
  const handleAgregarObra = () => {
    navigate("/home/nuevo-obra");
  };

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

  // Función para manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para manejar la baja de obras seleccionadas
  const handleBajaObras = () => {
    if (selectedObras.length === 0) {
      return;
    }
    console.log("Obras seleccionadas para dar de baja:", selectedObras);
  };

  // Función para manejar la copia de obras seleccionadas
  const handleCopiarObras = () => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para copiar.");
      return;
    }
    console.log("Obras seleccionadas para copiar:", selectedObras);
  };

  // Función para manejar la impresión de obras seleccionadas
  const handleImprimirObras = () => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para imprimir.");
      return;
    }
    console.log("Obras seleccionadas para imprimir:", selectedObras);
  };

  // ------------------- VARIABLES AUXILIARES --------------------- \\

  //#region VARIABLES PARA PAGINACIÓN
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
  //#endregion

  // ----------------------------- JSX -------------------------------------- \\

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

      <Alert variant="warning">
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

      <Alert variant="info">
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

      <Alert variant="danger">
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

      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Cód.</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Empresa</th>
              <th>F. Oferta</th>
              <th>R</th>
              <th>%P.</th>
              <th>%F.</th>
              <th>Acción</th>
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
                  <td>{obra.codigo_obra}</td>
                  <td>{obra.descripcion_obra}</td>
                  <td>{obra.desc_tipo_obra}</td>
                  <td>{obra.desc_estado_obra}</td>
                  <td>{obra.nombre_empresa}</td>
                  <td>
                    {obra.fecha_oferta
                      ? new Date(obra.fecha_oferta).toLocaleDateString("es-ES")
                      : "[No ofertada]"}
                  </td>
                  <td>{`${obra.rentabilidadPorcentaje ?? "-"} %`}</td>
                  <td>
                    {`${
                      obra.importe !== 0
                        ? (obra.total_pedidos / obra.importe) * 100
                        : 0
                    } %`}{" "}
                  </td>
                  <td>{`${
                    obra.importe !== 0
                      ? (obra.total_facturas / obra.importe) * 100
                      : 0
                  } %`}</td>
                  <td>
                    <Button
                      variant="info"
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
                <td colSpan="12">No se encontraron obras</td>
              </tr>
            )}
          </tbody>
        </Table>

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
    </div>
  );
};

export default ObrasList; // Exporta el componente ObrasList como predeterminado
