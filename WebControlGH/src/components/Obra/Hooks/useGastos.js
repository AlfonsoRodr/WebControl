import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService.js";
import { getTiposGastos } from "../Utils/calculos.js";

// HOOK PERSONALIZADO PARA TODA LA GESTIÓN DE GASTOS (HORAS, HORAS EXTRA, GASTOS, COMPRAS, ETC)

export const useGastos = (idObra) => {
  // Estados de datos
  const [gastos, setGastos] = useState([]);
  const [gastosHijas, setGastosHijas] = useState([]);
  const [horas, setHoras] = useState([]);
  const [horasHijas, setHorasHijas] = useState([]);
  const [horasExtra, setHorasExtra] = useState([]);
  const [horasExtraHijas, setHorasExtraHijas] = useState([]);
  const [movimientosAlmacen, setMovimientosAlmacen] = useState([]);
  const [facturasCompras, setFacturasCompras] = useState([]);
  const [tiposGastos, setTiposGastos] = useState([]);
  const [tiposGastosHijas, setTiposGastosHijas] = useState([]);

  // Estados de modales
  const [showModalGastoAlmacen, setShowModalGastoAlmacen] = useState(false);
  const [showModalCompras, setShowModalCompras] = useState(false);
  const [editIDGastoAlmacen, setEditIDGastoAlmacen] = useState(null);
  const [editIDCompra, setEditIDCompra] = useState(null);

  // Estados de búsqueda para almacén
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [sugerenciasProductos, setSugerenciasProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estados de búsqueda para compras
  const [busquedaFacturaCompra, setBusquedaFacturaCompra] = useState("");
  const [sugerenciasFacturasCompras, setSugerenciasFacturasCompras] = useState(
    []
  );
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  // Formularios
  const [formGastoAlmacen, setFormGastoAlmacen] = useState({
    idReferencia: "",
    fechaAlta: "",
    usuarioAlta: "",
    tipoMovimiento: "2",
    conceptoMovimiento: "3",
    cantidad: 0,
    importe: 0,
    observaciones: "",
    idObra: idObra,
  });

  const [formCompras, setFormCompras] = useState({
    idObra: Number(idObra),
    idFacturasCompras: "",
    importe: 0,
    fechaAlta: "",
    codigoUsuarioAlta: "",
    observaciones: "",
  });

  // Fetch functions
  const fetchGastos = async (idsObra, tipo = "Padre") => {
    try {
      const res = await obraService.getGastos(idsObra);
      if (tipo === "Padre") {
        setGastos(res.data.data);
        setTiposGastos(getTiposGastos(res.data.data));
      } else {
        setGastosHijas(res.data.data);
        setTiposGastosHijas(getTiposGastos(res.data.data));
      }
    } catch (err) {
      console.error(`Error al obtener gastos (${tipo}) - ${err}`);
    }
  };

  const fetchHoras = async (idsObra, tipo = "Padre") => {
    try {
      const res = await obraService.getHoras(idsObra);
      tipo === "Padre" ? setHoras(res.data.data) : setHorasHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener horas (${tipo}) - ${error}`);
    }
  };

  const fetchHorasExtra = async (idsObra, tipo = "Padre") => {
    try {
      const res = await obraService.getHorasExtra(idsObra);
      tipo === "Padre"
        ? setHorasExtra(res.data.data)
        : setHorasExtraHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener horas extra (${tipo}) - ${error}`);
    }
  };

  const fetchMovimientosAlmacen = async () => {
    try {
      const res = await obraService.getMovimientosAlmacen(idObra);
      setMovimientosAlmacen(res.data.data);
    } catch (error) {
      console.error(`Error al obtener movimientos de almacén - ${error}`);
    }
  };

  const fetchFacturasCompras = async () => {
    try {
      const res = await obraService.getFacturasCompras(idObra);
      setFacturasCompras(res.data.data);
    } catch (error) {
      console.error(`Error al obtener facturas de compras - ${error}`);
    }
  };

  // Handlers para gastos de almacén
  const handleAgregarGastoAlmacen = () => {
    setFormGastoAlmacen({
      idReferencia: "",
      fechaAlta: "",
      usuarioAlta: "",
      tipoMovimiento: "2",
      conceptoMovimiento: "3",
      cantidad: 0,
      importe: 0,
      observaciones: "",
      idObra: idObra,
    });
    setEditIDGastoAlmacen(null);
    setProductoSeleccionado(null);
    setShowModalGastoAlmacen(true);
  };

  const handleEditarGastoAlmacen = (gasto) => {
    setFormGastoAlmacen({
      idReferencia: gasto.id_referencia,
      fechaAlta: gasto.fecha_alta,
      usuarioAlta: gasto.codigo_usuario_alta,
      tipoMovimiento: gasto.id_tipomovimiento,
      conceptoMovimiento: gasto.id_conceptomovimiento,
      cantidad: gasto.cantidad,
      importe: gasto.importe,
      observaciones: gasto.observaciones,
      idObra: idObra,
    });
    setProductoSeleccionado({
      id: gasto.id_referencia,
      descripcion: gasto.descripcion_referencia,
    });
    setEditIDGastoAlmacen(gasto.id);
    setShowModalGastoAlmacen(true);
  };

  const handleGuardarGastoAlmacen = async () => {
    if (
      !formGastoAlmacen.idReferencia ||
      !formGastoAlmacen.fechaAlta ||
      !formGastoAlmacen.usuarioAlta ||
      !formGastoAlmacen.idObra
    ) {
      return alert("Faltan campos");
    }

    try {
      if (editIDGastoAlmacen) {
        await obraService.updateMovimientoAlmacen(
          editIDGastoAlmacen,
          formGastoAlmacen
        );
      } else {
        await obraService.createMovimientoAlmacen(formGastoAlmacen);
      }
      setShowModalGastoAlmacen(false);
      fetchMovimientosAlmacen();
    } catch (error) {
      console.error(`Error al guardar el gasto de almacén - ${error}`);
    }
  };

  const handleEliminarGastoAlmacen = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este gasto?")) {
      try {
        await obraService.deleteMovimientoAlmacen(id);
        fetchMovimientosAlmacen();
      } catch (error) {
        console.error(`Error al eliminar el gasto de almacén - ${error}`);
      }
    }
  };

  const handleChangeFormGastoAlmacen = (e) => {
    setFormGastoAlmacen((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Búsqueda de productos
  const handleBuscarProducto = async (e) => {
    const value = e.target.value;
    setBusquedaProducto(value);
    if (value.length > 2) {
      try {
        const res = await obraService.buscarProductos(value);
        setSugerenciasProductos(res.data.data);
      } catch (error) {
        console.error(`Error al buscar productos - ${error}`);
      }
    } else {
      setSugerenciasProductos([]);
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setFormGastoAlmacen((prev) => ({ ...prev, idReferencia: producto.id }));
    setBusquedaProducto("");
    setSugerenciasProductos([]);
  };

  const eliminarProducto = () => {
    setFormGastoAlmacen((prev) => ({ ...prev, idReferencia: "" }));
    setProductoSeleccionado(null);
  };

  // Handlers para compras
  const handleAgregarCompra = () => {
    setFormCompras({
      idObra: Number(idObra),
      idFacturasCompras: "",
      importe: 0,
      fechaAlta: "",
      codigoUsuarioAlta: "",
      observaciones: "",
    });
    setEditIDCompra(null);
    setFacturaSeleccionada(null);
    setShowModalCompras(true);
  };

  const handleEditarCompra = (compra) => {
    setFormCompras({
      idObra: Number(idObra),
      idFacturasCompras: compra.id_facturascompras,
      importe: compra.importe,
      fechaAlta: compra.fecha_alta.split("T")[0],
      codigoUsuarioAlta: compra.codigo_usuario_alta,
      observaciones: compra.observaciones,
    });
    setFacturaSeleccionada({
      id: compra.id_facturascompras,
      Numero: compra.Numero,
      Concepto: compra.Concepto,
    });
    setEditIDCompra(compra.id);
    setShowModalCompras(true);
  };

  const handleGuardarCompras = async () => {
    if (
      !formCompras.idFacturasCompras ||
      !formCompras.codigoUsuarioAlta ||
      !formCompras.fechaAlta
    ) {
      return alert("Faltan campos");
    }

    try {
      if (editIDCompra) {
        await obraService.updateFacturaCompra(editIDCompra, formCompras);
      } else {
        await obraService.createFacturaCompra(formCompras);
      }
      setShowModalCompras(false);
      fetchFacturasCompras();
    } catch (error) {
      console.error(`Error al guardar la compra - ${error}`);
    }
  };

  const handleEliminarCompra = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta compra?")) {
      try {
        await obraService.deleteFacturaCompra(id);
        fetchFacturasCompras();
      } catch (error) {
        console.error(`Error al eliminar la compra - ${error}`);
      }
    }
  };

  const handleChangeFormCompras = (e) => {
    const { name, value } = e.target;
    const camposNumericos = ["importe", "idObra", "codigoUsuarioAlta"];
    setFormCompras((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name) ? Number(value) : value,
    }));
  };

  // Búsqueda de facturas
  const handleBuscarFacturaCompra = async (e) => {
    const value = e.target.value;
    setBusquedaFacturaCompra(value);
    if (value.length > 2) {
      try {
        const res = await obraService.buscarFacturas(value);
        setSugerenciasFacturasCompras(res.data.data);
      } catch (error) {
        console.error(`Error al buscar facturas - ${error}`);
      }
    } else {
      setSugerenciasFacturasCompras([]);
    }
  };

  const seleccionarFacturaCompra = (factura) => {
    setFacturaSeleccionada(factura);
    setFormCompras((prev) => ({ ...prev, idFacturasCompras: factura.id }));
    setBusquedaFacturaCompra("");
    setSugerenciasFacturasCompras([]);
  };

  const eliminarFacturaCompra = () => {
    setFacturaSeleccionada(null);
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (idObra) {
      fetchGastos([idObra]);
      fetchHoras([idObra]);
      fetchHorasExtra([idObra]);
      fetchMovimientosAlmacen();
      fetchFacturasCompras();
    }
  }, [idObra]);

  return {
    gastos,
    gastosHijas,
    horas,
    horasHijas,
    horasExtra,
    horasExtraHijas,
    movimientosAlmacen,
    facturasCompras,
    tiposGastos,
    tiposGastosHijas,
    showModalGastoAlmacen,
    setShowModalGastoAlmacen,
    showModalCompras,
    setShowModalCompras,
    formGastoAlmacen,
    formCompras,
    editIDGastoAlmacen,
    editIDCompra,
    busquedaProducto,
    sugerenciasProductos,
    productoSeleccionado,
    busquedaFacturaCompra,
    sugerenciasFacturasCompras,
    facturaSeleccionada,
    handleAgregarGastoAlmacen,
    handleEditarGastoAlmacen,
    handleGuardarGastoAlmacen,
    handleEliminarGastoAlmacen,
    handleChangeFormGastoAlmacen,
    handleBuscarProducto,
    seleccionarProducto,
    eliminarProducto,
    handleAgregarCompra,
    handleEditarCompra,
    handleGuardarCompras,
    handleEliminarCompra,
    handleChangeFormCompras,
    handleBuscarFacturaCompra,
    seleccionarFacturaCompra,
    eliminarFacturaCompra,
    fetchGastos,
    fetchHoras,
    fetchHorasExtra,
    setGastosHijas,
    setHorasHijas,
    setHorasExtraHijas,
  };
};
