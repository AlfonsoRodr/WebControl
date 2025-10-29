// hooks/useObrasLista.js
import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService.js";

export const useObrasLista = () => {
  // Estados principales
  const [allObras, setAllObras] = useState([]);
  const [filteredObras, setFilteredObras] = useState([]);
  const [selectedObras, setSelectedObras] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para catálogos/desplegables
  const [catalogos, setCatalogos] = useState({
    tiposObra: [],
    estadosObra: [],
    empresas: [],
    edificios: [],
  });

  // Fetch de todas las obras
  const fetchObras = async () => {
    try {
      setLoading(true);
      const response = await obraService.getAllObras();
      const obras = response.data.data;

      setAllObras(obras);
      setFilteredObras(obras);

      return obras; // Retornar para usar en callbacks
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
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch de catálogos/desplegables
  const fetchCatalogos = async () => {
    try {
      const [tiposObra, estadosObra, empresas, edificios] = await Promise.all([
        obraService.getTiposObra(),
        obraService.getEstadosObra(),
        obraService.getEmpresas(),
        obraService.getEdificios(),
      ]);

      setCatalogos({
        tiposObra: tiposObra.data.data,
        estadosObra: estadosObra.data.data,
        empresas: empresas.data.data,
        edificios: edificios.data.data,
      });
    } catch (error) {
      console.error(`Error al obtener los catálogos - ${error}`);
    }
  };

  // Handlers de selección
  const handleSelectObra = (idObra) => {
    setSelectedObras((prevSelected) =>
      prevSelected.includes(idObra)
        ? prevSelected.filter((id) => id !== idObra)
        : [...prevSelected, idObra]
    );
  };

  const handleSelectAll = (obras) => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedObras(obras.map((obra) => obra.id_obra));
    } else {
      setSelectedObras([]);
    }
  };

  // Limpiar selecciones
  const clearSelections = () => {
    setSelectedObras([]);
    setSelectAll(false);
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchObras();
    fetchCatalogos();
  }, []);

  return {
    // Estados
    allObras,
    filteredObras,
    selectedObras,
    selectAll,
    loading,
    error,
    catalogos,

    // Setters (para usar desde otros hooks)
    setFilteredObras,
    setSelectedObras,

    // Funciones
    fetchObras,
    handleSelectObra,
    handleSelectAll,
    clearSelections,
  };
};
