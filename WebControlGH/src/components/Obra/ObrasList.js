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
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredObras, setFilteredObras] = useState([]); // Estado para las obras filtradas
  const [selectedObras, setSelectedObras] = useState([]); // Estado para las obras seleccionadas
  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox de seleccionar todo
  const [obrasSuperadas, setObrasSuperadas] = useState(0); // Estado para el conteo de obras superadas
  const [obrasFacturadas, setObrasFacturadas] = useState(0); // Estado para el conteo de obras facturadas
  const [obrasSeguimiento, setObrasSeguimiento] = useState(0); // Estado para el conteo de obras en seguimiento
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [allObras, setAllObras] = useState([]);
  const obrasPorPagina = 10; // Cantidad de obras por página
  const navigate = useNavigate(); // Hook para la navegación

  // Funcion autoinvocada que hace fetch de todas las obras y las almacena en la variable allObras.
  const fetchObras = async () => {
    try {
      const endpoint = "http://localhost:3002/obras";
      const response = await axios.get(endpoint);
      setAllObras(response.data);
      setFilteredObras(response.data);
      countObrasSuperadas(response.data);
      countObrasFacturadas(response.data);
      countObrasSeguimiento(response.data);
    } catch (error) {
      console.error(`Error al recuperar las obras - ${error}`);
    }
  };

  // Efecto para inicializar las obras filtradas y los conteos
  useEffect(() => {
    fetchObras();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para manejar la búsqueda de obras
  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredObras(allObras);
    } else {
      const filtered = allObras.filter(
        (obra) => obra.cod === searchTerm.toUpperCase()
      );
      setFilteredObras(filtered);
    }
  };

  // Función para contar las obras cuya horas imputadas superan las horas previstas
  const countObrasSuperadas = (obras) => {
    const superadas = obras.filter(
      (obra) => obra.horasImputadas > obra.horasPrevistas
    );
    setObrasSuperadas(superadas.length);
  };

  // Función para contar las obras confirmadas y totalmente facturadas hace más de 30 días
  const countObrasFacturadas = (obras) => {
    const facturadas = obras.filter((obra) => {
      if (obra.estado === "Confirmada" && obra.totalmenteFacturadas) {
        const facturacionDate = new Date(obra.fechaFacturacion);
        const today = new Date();
        const diffTime = Math.abs(today - facturacionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 30;
      }
      return false;
    });
    setObrasFacturadas(facturadas.length);
  };

  // Función para contar las obras en seguimiento
  const countObrasSeguimiento = (obras) => {
    const enSeguimiento = obras.filter((obra) => obra.fecha_seg !== null);
    setObrasSeguimiento(enSeguimiento.length);
  };

  // Función para manejar la adición de una nueva obra
  const handleAgregarObra = () => {
    navigate("/home/nuevo-obra");
  };

  // Función para manejar la selección de una obra
  const handleSelectObra = (cod) => {
    setSelectedObras((prevSelected) =>
      prevSelected.includes(cod)
        ? prevSelected.filter((id) => id !== cod)
        : [...prevSelected, cod]
    );
  };

  // Función para manejar la selección de todas las obras
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedObras(filteredObras.map((obra) => obra.cod));
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

  // Índices de inicio y fin de las obras a mostrar en la página actual
  const indexOfLastObra = currentPage * obrasPorPagina;
  const indexOfFirstObra = indexOfLastObra - obrasPorPagina;
  // Obras a mostrar en la página actual
  const obrasActuales = filteredObras.slice(indexOfFirstObra, indexOfLastObra);
  // Número total de páginas
  const totalPaginas = Math.ceil(filteredObras.length / obrasPorPagina);

  return (
    <div className="obras-list">
      <Alert variant="danger">
        Hay {obrasSuperadas} obras confirmadas cuyo número de horas imputadas
        supera las horas previstas.
        <Form.Select>
          <option>Seleccionar obra...</option>
          {allObras
            .filter((obra) => obra.horasImputadas > obra.horasPrevistas)
            .map((obra, index) => (
              <option key={index} value={obra.cod}>
                {obra.cod} - {obra.descripcion} - Gastos Generales:{" "}
                {obra.gastosGenerales} - Horas Previstas: {obra.horasPrevistas}{" "}
                - Horas Imputadas: {obra.horasImputadas}
              </option>
            ))}
        </Form.Select>
      </Alert>

      <Alert variant="warning">
        Hay {obrasFacturadas} obras confirmadas, totalmente facturadas hace más
        de 30 días.
        <Form.Select>
          <option>Seleccionar obra...</option>
          {allObras
            .filter((obra) => {
              if (obra.estado === "Confirmada" && obra.totalmenteFacturadas) {
                const facturacionDate = new Date(obra.fechaFacturacion);
                const today = new Date();
                const diffTime = Math.abs(today - facturacionDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 30;
              }
              return false;
            })
            .map((obra, index) => (
              <option key={index} value={obra.cod}>
                {obra.cod} - {obra.descripcion} - Última Factura:{" "}
                {obra.fechaFacturacion}
              </option>
            ))}
        </Form.Select>
      </Alert>

      <Alert variant="info">
        Hay {obrasSeguimiento} obras en seguimiento.
        <Form.Select>
          <option>Seleccionar obra...</option>
          {allObras
            .filter((obra) => obra.fecha_seg !== null)
            .map((obra, index) => (
              <option key={index} value={obra.cod}>
                {obra.cod} - {obra.descripcion} - Fecha de Seguimiento:{" "}
                {obra.fecha_seg} - Motivo: {obra.obs}
              </option>
            ))}
        </Form.Select>
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
              <th>Obs</th>
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
                      checked={selectedObras.includes(obra.cod)}
                      onChange={() => handleSelectObra(obra.cod)}
                    />
                  </td>
                  <td>{obra.cod}</td>
                  <td>{obra.descripcion}</td>
                  <td>{obra.tipo}</td>
                  <td>{obra.estado}</td>
                  <td>{obra.empresa}</td>
                  <td>{obra.fOferta}</td>
                  <td>{obra.obs}</td>
                  <td>{obra.r}</td>
                  <td>{obra.pP}</td>
                  <td>{obra.fP}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() =>
                        navigate(`/home/gestion-obras/detalle/${obra.cod}`)
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
    </div>
  );
};

export default ObrasList; // Exporta el componente ObrasList como predeterminado
