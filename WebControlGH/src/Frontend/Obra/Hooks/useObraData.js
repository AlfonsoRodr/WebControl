import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService";
import { normalizarFecha } from "../Utils/fechas";

export const useObraData = (idObra) => {
  const [obra, setObra] = useState({});
  const [rentabilidad, setRentabilidad] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editarObra, setEditarObra] = useState(false);
  const [enSeguimiento, setEnSeguimiento] = useState(false);
  const [ofertado, setOfertado] = useState(false);

  // Estados para catálogos
  const [catalogos, setCatalogos] = useState({
    tiposObra: [],
    tiposFacturables: [],
    estadosObra: [],
    usuarios: [],
    empresas: [],
    edificios: [],
    contactosEmpresa: [],
  });

  // Formulario de obra
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
    horasPrevistas: "",
    gastoPrevisto: "",
    importe: "",
    viabilidad: "",
    empresa: "",
    contacto: "",
    edificio: "",
    observaciones: "",
    observacionesInternas: "",
  });

  // Cargar datos de la obra
  const fetchObra = async () => {
    try {
      const res = await obraService.getObra(idObra);
      const obraData = res.data.data[0];
      setObra(obraData);

      setEnSeguimiento(obraData.fecha_seg ? true : false);
      setOfertado(obraData.fecha_oferta ? true : false);

      setFormObra({
        cod: obraData.codigo_obra,
        desc: obraData.descripcion_obra,
        fechaSeg: obraData.fecha_seg
          ? normalizarFecha(obraData.fecha_seg)
          : null,
        descSeg: obraData.descripcion_seg,
        tipoObra: Number(obraData.tipo_obra),
        facturable: Number(obraData.facturable),
        estadoObra: Number(obraData.estado_obra),
        fechaAlta: obraData.fecha_alta
          ? normalizarFecha(obraData.fecha_alta)
          : null,
        usuarioAlta: Number(obraData.codigo_usuario_alta),
        fechaFin: obraData.fecha_prevista_fin
          ? normalizarFecha(obraData.fecha_prevista_fin)
          : null,
        fechaOferta: obraData.fecha_oferta
          ? normalizarFecha(obraData.fecha_oferta)
          : null,
        horasPrevistas: Number(obraData.horas_previstas),
        gastoPrevisto: Number(obraData.gasto_previsto),
        importe: Number(obraData.importe),
        viabilidad: Number(obraData.viabilidad),
        empresa: Number(obraData.id_empresa),
        contacto: Number(obraData.id_contacto),
        edificio: Number(obraData.id_edificio),
        observaciones: obraData.observaciones,
        observacionesInternas: obraData.observaciones_internas,
      });

      // Cargar contactos de la empresa
      if (obraData.id_empresa) {
        fetchContactosEmpresa(obraData.id_empresa);
      }
    } catch (err) {
      setError(err);
      console.error(`Error al obtener la obra - ${err}`);
    }
  };

  // Cargar rentabilidad
  const fetchRentabilidad = async () => {
    try {
      const res = await obraService.getRentabilidad(idObra);
      setRentabilidad(res.data.data);
    } catch (err) {
      console.error(`Error al obtener la rentabilidad - ${err}`);
    }
  };

  // Cargar catálogos
  const fetchCatalogos = async () => {
    try {
      const [
        tiposObra,
        tiposFacturables,
        estadosObra,
        usuarios,
        empresas,
        edificios,
      ] = await Promise.all([
        obraService.getTiposObra(),
        obraService.getTiposFacturables(),
        obraService.getEstadosObra(),
        obraService.getUsuarios(),
        obraService.getEmpresas(),
        obraService.getEdificios(),
      ]);

      setCatalogos({
        tiposObra: tiposObra.data.data,
        tiposFacturables: tiposFacturables.data.data,
        estadosObra: estadosObra.data.data,
        usuarios: usuarios.data.data,
        empresas: empresas.data.data,
        edificios: edificios.data.data,
        contactosEmpresa: [],
      });
    } catch (error) {
      console.error(`Error al obtener los catálogos - ${error}`);
    }
  };

  const fetchContactosEmpresa = async (idEmpresa) => {
    try {
      const res = await obraService.getContactosEmpresa(idEmpresa);
      setCatalogos((prev) => ({ ...prev, contactosEmpresa: res.data.data }));
    } catch (error) {
      console.error(`Error al obtener los contactos - ${error}`);
    }
  };

  // Handlers
  const handleChangeFormObra = (e) => {
    const { name, value } = e.target;
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

    if (name === "empresa") {
      fetchContactosEmpresa(value);
    }
  };

  const handleChangeSeguimiento = () => {
    setEnSeguimiento((prev) => {
      const nuevoValor = !prev;
      if (nuevoValor) {
        setFormObra((prevForm) => ({
          ...prevForm,
          fechaSeg: obra.fecha_seg,
          descSeg: obra.descripcion_seg,
        }));
      } else {
        setFormObra((prevForm) => ({
          ...prevForm,
          fechaSeg: null,
          descSeg: "",
        }));
      }
      return nuevoValor;
    });
  };

  const handleChangeOfertado = () => {
    setOfertado((prev) => {
      const nuevoValor = !prev;
      if (nuevoValor) {
        setFormObra((prevForm) => ({
          ...prevForm,
          fechaOferta: obra.fecha_oferta,
        }));
      } else {
        setFormObra((prevForm) => ({
          ...prevForm,
          fechaOferta: null,
        }));
      }
      return nuevoValor;
    });
  };

  const handleGuardarObra = async () => {
    try {
      await obraService.updateObra(idObra, formObra);
      await fetchObra();
      setEditarObra(false);
    } catch (error) {
      console.error(`Error al guardar la obra - ${error}`);
    }
  };

  const handleCancelarObra = () => {
    fetchObra();
    setEditarObra(false);
  };

  const handleBajarObra = async (navigate) => {
    if (window.confirm("¿Estás seguro de querer eliminar esta obra?")) {
      try {
        await obraService.deleteObra(idObra);
        alert("Obra eliminada correctamente");
        navigate(-1);
      } catch (error) {
        alert("Error al eliminar la obra");
        console.error("Error al eliminar la obra", error);
      }
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchObra(), fetchRentabilidad(), fetchCatalogos()]);
      setLoading(false);
    };
    loadData();
  }, [idObra]);

  return {
    obra,
    rentabilidad,
    formObra,
    catalogos,
    loading,
    error,
    editarObra,
    enSeguimiento,
    ofertado,
    setEditarObra,
    handleChangeFormObra,
    handleChangeSeguimiento,
    handleChangeOfertado,
    handleGuardarObra,
    handleCancelarObra,
    handleBajarObra,
    fetchObra,
  };
};
