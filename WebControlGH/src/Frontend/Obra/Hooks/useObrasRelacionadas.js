import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService.js";

export const useObrasRelacionadas = (idObra) => {
  // Obra padre
  const [obraPadre, setObraPadre] = useState(null);
  const [busquedaPadre, setBusquedaPadre] = useState("");
  const [sugerenciasPadre, setSugerenciasPadre] = useState([]);

  // Obras hijas
  const [obrasHijas, setObrasHijas] = useState([]);
  const [busquedaHijas, setBusquedaHijas] = useState("");
  const [sugerenciasHijas, setSugerenciasHijas] = useState([]);

  // Fetch obra padre
  const fetchObraPadre = async () => {
    try {
      const res = await obraService.getObraPadre(idObra);
      if (res.data.data && res.data.data.length > 0) {
        setObraPadre(res.data.data[0]);
      } else {
        setObraPadre(null);
      }
    } catch (error) {
      console.error(`Error al obtener la obra padre - ${error}`);
    }
  };

  // Fetch obras hijas
  const fetchObrasHijas = async () => {
    try {
      const res = await obraService.getObrasHijas(idObra);
      setObrasHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener las obras hijas - ${error}`);
    }
  };

  // Búsqueda obra padre
  const handleBuscarPadre = async (e) => {
    const value = e.target.value;
    setBusquedaPadre(value);
    if (value.length > 2) {
      try {
        const res = await obraService.buscarObrasPorDescripcion(value);
        setSugerenciasPadre(res.data.data);
      } catch (error) {
        console.error(`Error al buscar obras - ${error}`);
      }
    } else {
      setSugerenciasPadre([]);
    }
  };

  const seleccionarObraPadre = (obra) => {
    setObraPadre(obra);
    setBusquedaPadre("");
    setSugerenciasPadre([]);
  };

  const eliminarObraPadre = () => {
    setObraPadre(null);
  };

  // Búsqueda obras hijas
  const handleBuscarHija = async (e) => {
    const value = e.target.value;
    setBusquedaHijas(value);
    if (value.length > 2) {
      try {
        const res = await obraService.buscarObrasPorDescripcion(value);
        setSugerenciasHijas(res.data.data);
      } catch (error) {
        console.error(`Error al buscar obras - ${error}`);
      }
    } else {
      setSugerenciasHijas([]);
    }
  };

  const agregarObraHija = (obra) => {
    if (!obrasHijas.some((o) => o.id_obra === obra.id_obra)) {
      const nuevasObras = [...obrasHijas, obra];
      setObrasHijas(nuevasObras);
    }
    setBusquedaHijas("");
    setSugerenciasHijas([]);
  };

  const eliminarObraHija = (idObraHija) => {
    const nuevasObras = obrasHijas.filter((o) => o.id_obra !== idObraHija);
    setObrasHijas(nuevasObras);
  };

  // Guardar relaciones en el backend
  const handleGuardarRelaciones = async () => {
    try {
      // Guardar obra padre
      const idObraPadre = obraPadre ? obraPadre.id_obra : null;
      await obraService.setObraPadre({ idObraPadre, idObraHija: idObra });

      // Guardar obras hijas
      const idsObrasHijas =
        obrasHijas.length > 0 ? obrasHijas.map((obra) => obra.id_obra) : [];
      await obraService.setObrasHijas({ idObraPadre: idObra, idsObrasHijas });
    } catch (error) {
      console.error(`Error al guardar las relaciones de obras - ${error}`);
    }
  };

  // Cancelar cambios
  const handleCancelarRelaciones = () => {
    fetchObraPadre();
    fetchObrasHijas();
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (idObra) {
      fetchObraPadre();
      fetchObrasHijas();
    }
  }, [idObra]);

  return {
    obraPadre,
    obrasHijas,
    busquedaPadre,
    sugerenciasPadre,
    busquedaHijas,
    sugerenciasHijas,
    handleBuscarPadre,
    seleccionarObraPadre,
    eliminarObraPadre,
    handleBuscarHija,
    agregarObraHija,
    eliminarObraHija,
    handleGuardarRelaciones,
    handleCancelarRelaciones,
  };
};
