/* ARCHIVO ANTIGUO SIN REFACTORIZAR. NO USAR. LO MANTENEMOS DE BACKUP DE MOMENTO*/

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
  Modal,
} from "react-bootstrap";
import axios, { all } from "axios";

const DetalleObra = () => {
  const { idObra } = useParams(); // Obtiene el código de la obra desde la URL
  const navigate = useNavigate();

  // ------------- ESTADOS PARA LOS DESPLEGABLES ---------- \\

  //#region

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

  // ------------- ESTADOS PARA LA OBRA ------------------ \\

  //#region

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
  // Estado para las facturas asociadass a las obras subordinadas (SI SE NECESITA EN EL FUTURO)
  const [facturasObrasHijas, setFacturasObrasHijas] = useState([]);
  // Estado para los pedidos asociados a una obra
  const [pedidosObra, setPedidosObra] = useState([]);
  // Estado para los pedidos asociados a las obras subordinadas (SI SE NECESITA EN EL FUTURO)
  const [pedidosObrasHija, setPedidosObrasHijas] = useState([]);
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
  // Estado para el listado de movimientos de almacén asociados a una obra
  const [movimientosAlmacenObra, setMovimientosAlmacenObra] = useState([]);
  // Estado para las facturas de las compras asociadas a una obra
  const [facturasComprasObra, setFacturasComprasObra] = useState([]);

  //#endregion

  // --------- ESTADOS PARA LA BUSQUEDA DE OBRA PADRE Y SUBORDINADAS --------- \\

  //#region

  const [obraPadreBusqueda, setObraPadreBusqueda] = useState("");
  const [sugerenciasPadre, setSugerenciasPadre] = useState([]);
  const [obraPadreSeleccionada, setObraPadreSeleccionada] = useState(null);

  const [obraHijaBusqueda, setObraHijaBusqueda] = useState("");
  const [sugerenciasHijas, setSugerenciasHijas] = useState([]);
  const [obrasHijasSeleccionadas, setObrasHijasSeleccionadas] = useState([]);

  //#endregion

  // --------- ESTADOS PARA LA BUSQUEDA DE PRODUCTOS POR REFERENCIA  --------- \\

  //#region

  const [productoBusqueda, setProductoBusqueda] = useState("");
  const [sugerenciasProductos, setSugerenciasProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  //#endregion

  // --------- ESTADOS PARA LA BUSQUEDA DE FACTURAS  --------- \\

  //#region

  const [facturaBusqueda, setFacturaBusqueda] = useState("");
  const [sugerenciasFacturas, setSugerenciasFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  //#endregion

  // ------------------- ESTADOS AUXILIARES --------------------------------- \\

  //#region

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
  // Estado para la modal de detalles de pedidos
  const [showModalPedidos, setShowModalPedidos] = useState(false);
  // Estado para la modal de detalles de facturas
  const [showModalFacturas, setShowModalFacturas] = useState(false);
  // Estado para la modal de detalles de gastos almacen
  const [showModalGastoAlmacen, setShowModalGastoAlmacen] = useState(false);
  // Estado para la modal de detalles de las compras
  const [showModalCompras, setShowModalCompras] = useState(false);

  //#endregion

  // ------------------- ESTADOS PARA LOS FORMS -------------------------- \\

  //#region

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

  const [formPedidos, setFormPedidos] = useState({
    fechaPedido: "",
    codigoPedido: "",
    posicion: "",
    importe: "",
    observaciones: "",
    idObra: "",
  });

  const [formFacturas, setFormFacturas] = useState({
    idPedido: "",
    codigoPedido: "",
    fechaFactura: "",
    codigo: "",
    posicion: "",
    importe: "",
    conceptoFactura: "",
    conceptoLinea: "",
    observaciones: "",
    idObra: "",
    cobrado: false,
    fechaCobro: "",
  });

  const [formGastoAlmacen, setFormGastoAlmacen] = useState({
    idReferencia: "",
    fechaAlta: "",
    usuarioAlta: "",
    tipoMovimiento: "",
    conceptoMovimiento: "",
    cantidad: "",
    importe: "",
    observaciones: "",
    idObra: "",
  });

  const [formCompras, setFormCompras] = useState({
    idObra: "",
    idFacturasCompras: "",
    importe: "",
    fechaAlta: "",
    codigoUsuarioAlta: "",
    observaciones: "",
  });

  const [editIDPedido, setEditIDPedido] = useState(null);
  const [editIDFactura, setEditIDFactura] = useState(null);
  const [editIDGastoAlmacen, setEditIDGastoAlmacen] = useState(null);
  const [editIDCompra, setEditIDCompra] = useState(null);

  //#endregion

  // ------------------- ESTADOS PARA HABILITAR CAMBIOS ------------------ \\

  //#region

  const [editarObra, setEditarObra] = useState(false);

  //#endregion

  // ----------------------- FETCH DE DATOS ------------------------------- \\

  //#region

  // Fetch de la obra
  const fetchObra = async (idObra) => {
    const endpoint = `http://localhost:3002/api/obra/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFilteredObra(res.data.data[0]);
      fetchContactosEmpresa(res.data.data[0].id_empresa);
      setEnSeguimiento(res.data.data[0].fecha_seg ? true : false);
      setOfertado(res.data.data[0].fecha_oferta ? true : false);
      setFormObra({
        cod: res.data.data[0].codigo_obra,
        desc: res.data.data[0].descripcion_obra,
        fechaSeg: res.data.data[0].fecha_seg
          ? normalizarFecha(res.data.data[0].fecha_seg)
          : null,
        descSeg: res.data.data[0].descripcion_seg,
        tipoObra: Number(res.data.data[0].tipo_obra),
        facturable: Number(res.data.data[0].facturable),
        estadoObra: Number(res.data.data[0].estado_obra),
        fechaAlta: res.data.data[0].fecha_alta
          ? normalizarFecha(res.data.data[0].fecha_alta)
          : null,
        usuarioAlta: Number(res.data.data[0].codigo_usuario_alta),
        fechaFin: res.data.data[0].fecha_prevista_fin
          ? normalizarFecha(res.data.data[0].fecha_prevista_fin)
          : null,
        fechaOferta: res.data.data[0].fecha_oferta
          ? normalizarFecha(res.data.data[0].fecha_oferta)
          : null,
        horasPrevistas: Number(res.data.data[0].horas_previstas),
        gastoPrevisto: Number(res.data.data[0].gasto_previsto),
        importe: Number(res.data.data[0].importe),
        viabilidad: Number(res.data.data[0].viabilidad),
        empresa: Number(res.data.data[0].id_empresa),
        contacto: Number(res.data.data[0].id_contacto),
        edificio: Number(res.data.data[0].id_edificio),
        observaciones: res.data.data[0].observaciones,
        observacionesInternas: res.data.data[0].observaciones_internas,
      });
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
  const fetchFacturas = async (idsObras, tipo) => {
    const endpoint = `http://localhost:3002/api/ecoFactura/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObras });
      tipo === "Padre"
        ? setFacturasObra(res.data.data)
        : setFacturasObrasHijas(res.data.data);
    } catch (err) {
      console.error(
        `Error al obtener las facturas de la obra (${tipo}) - ${err}`
      );
    }
  };

  // Fetch de los pedidos asociados a una obra
  const fetchPedidos = async (idsObras, tipo) => {
    const endpoint = `http://localhost:3002/api/ecoPedido/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObras });
      tipo === "Padre"
        ? setPedidosObra(res.data.data)
        : setPedidosObrasHijas(res.data.data);
    } catch (err) {
      console.error(
        `Error al obtener los pedidos de la obra (${tipo}) - ${err}`
      );
    }
  };

  // Fetch de los gastos asociados a una obra
  const fetchGastos = async (idsObra, tipo) => {
    const endpoint = `http://localhost:3002/api/gastos/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      if (tipo === "Padre") {
        setGastosObra(res.data.data);
        getTiposGastos(res.data.data, "Padre");
      } else {
        setGastosObrasHijas(res.data.data);
        getTiposGastos(res.data.data, "Hijas");
      }
    } catch (err) {
      console.error(
        `Error al obtener los gastos de la obra (${tipo}) - ${err}`
      );
    }
  };

  // Fetch de las horas asociadas a una obra
  const fetchHoras = async (idsObra, tipo) => {
    const endpoint = `http://localhost:3002/api/horas/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      tipo === "Padre"
        ? setHorasObra(res.data.data)
        : setHorasObrasHijas(res.data.data);
    } catch (error) {
      console.error(
        `Error al obtener las horas de la obra (${tipo}) - ${error}`
      );
    }
  };

  // Fetch de las horas extra asociadas a una obra
  const fetchHorasExtra = async (idsObra, tipo) => {
    const endpoint = `http://localhost:3002/api/gastos/horas-extra/buscar`;
    try {
      const res = await axios.post(endpoint, { idsObra });
      tipo === "Padre"
        ? setHorasExtraObra(res.data.data)
        : setHorasExtraObrasHijas(res.data.data);
      setHorasExtraObra(res.data.data);
    } catch (error) {
      console.error(
        `Error al obtener las horas extra de la obra (${tipo}) - ${error}`
      );
    }
  };

  // Fetch de la obra padre
  const fetchObraPadre = async (idObra) => {
    const endpoint = `http://localhost:3002/api/relacion-obras/padre/${idObra}`;
    try {
      const res = await axios.get(endpoint);
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
      setObrasHijasSeleccionadas(res.data.data);
      // IDs de las obras hijas
      const idsObrasHijas = res.data.data.map(
        (obraHija) => obraHija.id_obraHija
      );
      fetchGastos(idsObrasHijas, "Hijas");
      fetchHoras(idsObrasHijas, "Hijas");
      fetchHorasExtra(idsObrasHijas, "Hijas");
      fetchPedidos(idsObrasHijas, "Hijas");
      fetchFacturas(idsObrasHijas, "Hijas");
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

  const fetchMovimientosAlmacen = async (idObra) => {
    const endpoint = `http://localhost:3002/api/movimientos-almacen/obra/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setMovimientosAlmacenObra(res.data.data);
    } catch (error) {
      console.error(`Error al obtener los movimientos de almacén - ${error}`);
    }
  };

  const fetchFacturasCompras = async (idObra) => {
    const endpoint = `http://localhost:3002/api/facturas/obra/${idObra}`;
    try {
      const res = await axios.get(endpoint);
      setFacturasComprasObra(res.data.data);
    } catch (error) {
      console.error(`Error al obtener las facturas de compras - ${error}`);
    }
  };

  //#endregion

  // ------------------------- USE EFFECT ------------------------- \\
  //#region
  useEffect(() => {
    fetchObra(idObra);
    fetchRentabilidad(idObra);
    fetchFacturas([idObra], "Padre");
    fetchPedidos([idObra], "Padre");
    fetchGastos([idObra], "Padre");
    fetchHoras([idObra], "Padre");
    fetchHorasExtra([idObra], "Padre");
    fetchObraPadre(idObra);
    fetchObrasHijas(idObra);
    fetchDatosFormulario();
    fetchMovimientosAlmacen(idObra);
    fetchFacturasCompras(idObra);
  }, []);

  //#endregion

  if (!filteredObra) {
    return <h2>Obra no encontrada</h2>;
  }

  // ----------------------------- HANDLERS y FUNCIONES AUXILIARES ----------------------- \\

  //#region FUNCION PARA NORMALIZAR FECHAS (Evita que las fechas bajen un día tras actualización + recarga de página pero no funciona)

  const normalizarFecha = (fechaISO) => {
    if (!fechaISO) return null;
    const fecha = new Date(fechaISO);
    return fecha.toISOString().split("T")[0];
  };

  //#endregion

  //#region HANDLERS PARA EnSeguimiento y Ofertado

  const handleChangeSeguimiento = () => {
    setEnSeguimiento((prev) => {
      const nuevoValor = !prev;

      if (nuevoValor) {
        setFormObra((prevForm) => ({
          ...prevForm,
          fechaSeg: filteredObra.fecha_seg,
          descSeg: filteredObra.descripcion_seg,
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
          fechaOferta: filteredObra.fecha_oferta,
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

  //#endregion

  //#region ADICION/EDICION/ELIMINACION DE PEDIDOS

  const handleAgregarPedido = () => {
    setFormPedidos({
      fechaPedido: new Date(),
      codigoPedido: "",
      posicion: "",
      importe: "",
      observaciones: "",
      idObra: filteredObra.id_obra,
    });
    setEditIDPedido(null);
    setShowModalPedidos(true);
  };

  const handleGuardarPedido = async () => {
    // TODO: AÑADIR VALIDACIONES DE LOS CAMPOS
    if (
      !formPedidos.codigoPedido ||
      !formPedidos.fechaPedido ||
      !formPedidos.importe ||
      !formPedidos.posicion
    ) {
      return alert("Faltan campos");
    }
    try {
      // EDICION
      if (editIDPedido) {
        await axios.put(
          `http://localhost:3002/api/ecoPedido/${editIDPedido}`,
          formPedidos
        );
      }
      // GUARDADO
      else {
        await axios.post(`http://localhost:3002/api/ecoPedido`, formPedidos);
      }
      setShowModalPedidos(false);
      fetchPedidos([idObra], "Padre");
    } catch (error) {
      console.error(`Error al guardar el pedido - ${error}`);
    }
  };

  const handleEditarPedido = (pedido) => {
    setFormPedidos({
      fechaPedido: pedido.fecha,
      codigoPedido: pedido.codigo_pedido,
      posicion: pedido.posicion,
      importe: pedido.importe,
      observaciones: pedido.observaciones,
    });
    setEditIDPedido(pedido.id_pedido);
    setShowModalPedidos(true);
  };

  // Función para eliminar un pedido
  const handleDeletePedido = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await axios.delete(`http://localhost:3002/api/ecoPedido/${id}`);
        fetchPedidos([idObra], "Padre");
      } catch (error) {
        console.error(`Error al eliminar el pedido - ${error}`);
      }
    }
  };

  const handleChangeFormPedidos = (e) => {
    setFormPedidos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //#endregion

  //#region ADICION/EDICION/ELIMINACION DE FACTURAS Y CAMBIOS EN EL FORM

  const handleAgregarFactura = () => {
    setFormFacturas({
      idPedido: "",
      codigoPedido: "",
      fechaFactura: new Date(),
      codigo: "",
      posicion: "",
      importe: "",
      conceptoFactura: "",
      conceptoLinea: "",
      observaciones: "",
      idObra: filteredObra.id_obra,
      fechaCobro: new Date(),
    });
    setEditIDFactura(null);
    setShowModalFacturas(true);
  };

  const handleEditarFactura = (factura) => {
    setFormFacturas({
      idPedido: factura.id_pedido,
      codigoPedido: factura.codigo_pedido,
      fechaFactura: factura.fecha,
      codigo: factura.codigo_factura,
      posicion: factura.posicion,
      importe: factura.importe,
      conceptoFactura: factura.concepto_factura,
      conceptoLinea: factura.concepto_linea,
      observaciones: factura.observaciones,
      cobrado: factura.fecha_cobro ? true : false,
      fechaCobro: factura.fecha_cobro ?? new Date(),
    });
    setEditIDFactura(factura.id_factura);
    setShowModalFacturas(true);
  };

  // Función para eliminar una factura
  const handleDeleteFactura = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta factura?")) {
      try {
        await axios.delete(`http://localhost:3002/api/ecoFactura/${id}`);
        fetchFacturas([idObra], "Padre");
      } catch (error) {
        console.error(`Error al eliminar la factura - ${error}`);
      }
    }
  };

  const handleChangeFormFacturas = (e) => {
    if (e.target.type === "checkbox") {
      setFormFacturas((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setFormFacturas((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      if (e.target.name === "idPedido") {
        const result = pedidosObra.filter(
          (pedido) => pedido.id_pedido == e.target.value
        );
        setFormFacturas((prev) => ({ ...prev, importe: result[0].importe }));
      }
    }
  };

  const handleGuardarFactura = async () => {
    // TODO: AÑADIR VALIDACIONES DE CAMPOS
    if (
      !formFacturas.idPedido ||
      !formFacturas.codigo ||
      !formFacturas.posicion ||
      !formFacturas.importe
    ) {
      return alert("Faltan campos");
    }

    try {
      // EDICION
      if (editIDFactura) {
        await axios.put(
          `http://localhost:3002/api/ecoFactura/${editIDFactura}`,
          formFacturas
        );
      }
      // ADICION
      else {
        await axios.post("http://localhost:3002/api/ecoFactura", formFacturas);
      }
      setShowModalFacturas(false);
      fetchFacturas([idObra], "Padre");
    } catch (error) {
      console.error(`Error al guardar la factura- ${error}`);
    }
  };

  //#endregion

  //#region  ADICION/EDICION/ELIMINACION DE GASTOS DE ALMACEN
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

  const handleGuardarGastoAlmacen = async () => {
    if (
      !formGastoAlmacen.idReferencia ||
      !formGastoAlmacen.fechaAlta ||
      !formGastoAlmacen.usuarioAlta ||
      !formGastoAlmacen.idObra
    ) {
      console.log(formGastoAlmacen);
      return alert("Faltan campos");
    }

    try {
      if (editIDGastoAlmacen) {
        await axios.put(
          `http://localhost:3002/api/movimientos-almacen/${editIDGastoAlmacen}`,
          formGastoAlmacen
        );
      } else {
        await axios.post(
          `http://localhost:3002/api/movimientos-almacen`,
          formGastoAlmacen
        );
      }
      setShowModalGastoAlmacen(false);
      fetchMovimientosAlmacen(idObra);
    } catch (error) {
      console.error(`Error al guardar el gasto de almacen - ${error}`);
    }
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

  const handleDeleteGastoAlmacen = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este gasto?")) {
      try {
        await axios.delete(
          `http://localhost:3002/api/movimientos-almacen/${id}`
        );
        fetchMovimientosAlmacen(idObra);
      } catch (error) {
        console.error(`Error al eliminar el gasto de almacen - ${error}`);
      }
    }
  };

  const handleChangeFormGastoAlmacen = (e) => {
    setFormGastoAlmacen((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  //#endregion

  //#region ADICION/EDICION/ELIMINACION DE COMPRAS DE UNA OBRA

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

  const handleGuardarCompras = async () => {
    console.log(formCompras);
    if (
      !formCompras.idFacturasCompras ||
      !formCompras.codigoUsuarioAlta ||
      !formCompras.fechaAlta
    ) {
      return alert("Faltan campos");
    }

    try {
      if (editIDCompra) {
        await axios.patch(
          `http://localhost:3002/api/facturas/${editIDCompra}`,
          formCompras
        );
      } else {
        await axios.post(`http://localhost:3002/api/facturas`, formCompras);
      }
      setShowModalCompras(false);
      fetchFacturasCompras(idObra);
    } catch (error) {
      console.error(`Error al guardar la compra - ${error}`);
    }
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

  const handleDeleteCompra = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta compra?")) {
      try {
        await axios.delete(`http://localhost:3002/api/facturas/${id}`);
        fetchFacturasCompras(idObra);
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

  //#endregion

  //#region GET TIPOS DE GASTOS

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

  //#endregion

  //#region HANDLERS PARA BUSQUEDA/SELECCION/ELIMINACION DE OBRAS RELACIONADAS

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
      setObrasHijasSeleccionadas(() => {
        const nuevoValor = [...obrasHijasSeleccionadas, obra];
        const idsObrasHijas = nuevoValor.map((obraHija) => obraHija.id_obra);
        // Fetch de los gastos, horas, horas extra, pedidos y facturas de las obras hijas
        fetchGastos(idsObrasHijas, "Hijas");
        fetchHoras(idsObrasHijas, "Hijas");
        fetchHorasExtra(idsObrasHijas, "Hijas");
        fetchPedidos(idsObrasHijas, "Hijas");
        fetchFacturas(idsObrasHijas, "Hijas");
        return nuevoValor;
      });
    }
    setObraHijaBusqueda("");
    setSugerenciasHijas([]);
  };

  const eliminarObraHija = (idObra) => {
    setObrasHijasSeleccionadas(() => {
      const nuevoValor = obrasHijasSeleccionadas.filter(
        (o) => o.id_obra !== idObra
      );
      const idsObrasHijas = nuevoValor.map((obraHija) => obraHija.id_obra);
      // Fetch de los gastos, horas, horas extra, pedidos y facturas de las obras hijas
      fetchGastos(idsObrasHijas, "Hijas");
      fetchHoras(idsObrasHijas, "Hijas");
      fetchHorasExtra(idsObrasHijas, "Hijas");
      fetchPedidos(idsObrasHijas, "Hijas");
      fetchFacturas(idsObrasHijas, "Hijas");
      return nuevoValor;
    });
  };

  //#endregion

  //#region HANDLER PARA BUSQUEDA/SELECCION/ELIMINACION DE PRODUCTOS
  const handleProductoBusqueda = async (e) => {
    const value = e.target.value;
    setProductoBusqueda(value);
    if (value.length > 2) {
      try {
        const endpoint = `http://localhost:3002/api/almacen/buscar/descripcion?descripcion=${value}`;
        const res = await axios.get(endpoint);
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
    setProductoBusqueda("");
    setSugerenciasProductos([]);
  };

  const eliminarProducto = () => {
    setFormGastoAlmacen((prev) => ({ ...prev, idReferencia: "" }));
    setProductoSeleccionado(null);
  };

  //#endregion

  //#region HANDLER PARA BUSQUEDA/SELECCION/ELIMINACION DE FACTURAS
  const handleFacturaBusqueda = async (e) => {
    const value = e.target.value;
    setFacturaBusqueda(value);
    if (value.length > 2) {
      try {
        const endpoint = `http://localhost:3002/api/facturas/buscar/concepto?concepto=${value}`;
        const res = await axios.get(endpoint);
        setSugerenciasFacturas(res.data.data);
      } catch (error) {
        console.error(`Error al buscar facturas - ${error}`);
      }
    } else {
      setSugerenciasFacturas([]);
    }
  };

  const seleccionarFactura = (factura) => {
    setFacturaSeleccionada(factura);
    setFormCompras((prev) => ({ ...prev, idFacturasCompras: factura.id }));
    setFacturaBusqueda("");
    setSugerenciasFacturas([]);
  };

  const eliminarFactura = () => {
    setFacturaSeleccionada(null);
  };

  //#endregion

  //#region FUNCIONES DE CÁLCULO

  // Suma de los gastos
  const totalImporteGastos = gastosObra.reduce(
    (acc, gasto) => acc + gasto.cantidad * gasto.importe,
    0
  );

  // Suma de los gastos de las obras subordinadas
  const totalImporteGastosSub = gastosObrasHijas.reduce(
    (acc, gasto) => acc + gasto.cantidad * gasto.importe,
    0
  );

  // Suma de las horas
  const totalHoras = horasObra.reduce((acc, hora) => acc + hora.num_horas, 0);

  // Importe total de las horas
  const totalImporteHoras = horasObra.reduce(
    (acc, hora) => acc + hora.num_horas * hora.precio_hora,
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

  // Suma de los importes de los pedidos de la obra
  const totalImportePedidos = pedidosObra.reduce(
    (acc, pedido) => acc + pedido.importe,
    0
  );

  // Suma de los importes de las facturas de la obra
  const totalImporteFacturas = facturasObra.reduce(
    (acc, factura) => acc + factura.importe,
    0
  );

  // Suma de los importes de los movimientos del almacen
  const totalImporteMovimientosAlmacen = movimientosAlmacenObra.reduce(
    (acc, movimiento) => acc + movimiento.cantidad * movimiento.importe,
    0
  );

  // Suma de los importes de las compras
  const totalImporteCompras = facturasComprasObra.reduce(
    (acc, factura) => acc + factura.importe,
    0
  );

  // Suma de las horas de las obras subordinadas
  const totalHorasSub = horasObrasHijas.reduce(
    (acc, hora) => acc + hora.num_horas,
    0
  );

  // Suma del importe de las horas de las obras subordinadas
  const totalImporteHorasSub = horasObrasHijas.reduce(
    (acc, hora) => acc + hora.num_horas * hora.precio_hora,
    0
  );

  // Suma de las horas extra de las obras subordinadas
  const totalHorasExtraSub = horasExtraObrasHijas.reduce(
    (acc, hora) => acc + hora.cantidad,
    0
  );

  // Suma de importe de las horas extra de las obras subordinadas
  const totalImporteHorasExtraSub = horasExtraObrasHijas.reduce(
    (acc, hora) => acc + hora.importe * hora.cantidad,
    0
  );

  // Suma de las horas previstas de las obras subordinadas
  const totalHorasPrevistasSub = obrasHijasSeleccionadas.reduce(
    (acc, obra) => acc + obra.horas_previstas,
    0
  );

  // Suma de los importes de las obras subordinadas
  const totalImporteObrasSub = obrasHijasSeleccionadas.reduce(
    (acc, obra) => acc + obra.importe,
    0
  );

  // Suma de los gastos previstos de las obras subordinadas
  const totalGastosPrevistosSub = obrasHijasSeleccionadas.reduce(
    (acc, obra) => acc + obra.gasto_previsto,
    0
  );

  // Suma de los importes de las facturas de las obras subordinadas
  const totalImporteFacturasSub = facturasObrasHijas.reduce(
    (acc, factura) => acc + factura.importe,
    0
  );

  // Suma de los importes de los pedidos de los pedidos de las obras subordinadas
  const totalImportePedidosSub = pedidosObrasHija.reduce(
    (acc, pedido) => acc + pedido.importe,
    0
  );

  // Gasto total
  const gastoTotal =
    totalImporteHoras +
    totalImporteGastos +
    totalImporteHorasExtra +
    totalImporteMovimientosAlmacen +
    totalImporteCompras;
  // Gasto total subordinadas (Sin incluir todavía gasto de almacen y compras)
  const gastoTotalSub =
    totalImporteHorasSub + totalImporteGastosSub + totalImporteHorasExtraSub;

  //#endregion

  //#region FORM OBRA, GUARDAR/CANCELAR CAMBIOS, DAR DE BAJA OBRA Y GUARDAR RELACIONES DE OBRAS

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

    // Cada vez que cambiamos la empresa, debemos hacer un fetch de los usuarios
    // asociados a dicha empresa
    if (name === "empresa") {
      fetchContactosEmpresa(value);
    }
  };

  const handleGuardarRelacionPadre = async () => {
    const endpoint = "http://localhost:3002/api/relacion-obras/padre";
    try {
      const idObraPadre = obraPadreSeleccionada
        ? obraPadreSeleccionada.id_obra
        : null;
      const idObraHija = idObra;
      await axios.post(endpoint, { idObraPadre, idObraHija });
    } catch (error) {
      console.error(`Error al establecer la obra padre - ${error}`);
    }
  };

  const handleGuardarRelacionHijas = async () => {
    const endpoint = "http://localhost:3002/api/relacion-obras/hijas";
    try {
      const idObraPadre = idObra;
      const idsObrasHijas =
        obrasHijasSeleccionadas.length > 0
          ? obrasHijasSeleccionadas.map((obra) => obra.id_obra)
          : [];
      await axios.post(endpoint, { idObraPadre, idsObrasHijas });
    } catch (error) {
      console.error(`Error al establecer las obras hijas - ${error}`);
    }
  };

  const handleGuardarObra = async () => {
    const endpoint = `http://localhost:3002/api/obra/${idObra}`;
    try {
      await axios.put(endpoint, formObra);
    } catch (error) {
      console.error(`Error al guardar la obra - ${error}`);
    }
  };

  const handleGuardarCambios = () => {
    // QUIZÁS HABRÍA QUE AÑADIR AQUÍ UN GUARDADO DE LOS DATOS DE RENTABILIDAD
    handleGuardarRelacionPadre();
    handleGuardarRelacionHijas();
    handleGuardarObra();
    setEditarObra(false);
  };

  const handleCancelarCambios = () => {
    fetchObra(idObra);
    fetchObraPadre(idObra);
    fetchObrasHijas(idObra);
    setEditarObra(false);
  };

  const handleBajarObra = async () => {
    if (window.confirm("¿Estás seguro de querer eliminar esta obra?")) {
      try {
        await axios.delete(`http://localhost:3002/api/obra/${idObra}`);
        alert("Obra eliminada correctamente");
        // Nos dirijimos a la página anterior
        navigate(-1);
      } catch (error) {
        alert("Error al eliminar la obra");
        console.error("Error al eliminar la obra", error);
      }
    }
  };

  //#endregion

  // -------------------------------------------------------------------------------------- \\

  //#region JSX

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
              name="cod"
              value={formObra.cod || ""}
              onChange={handleChangeFormObra}
              disabled={!editarObra}
            />
          </Form.Group>

          <Form.Group controlId="obraDescripcion" className="mt-2">
            <Form.Label>
              <strong>Descripción:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              name="desc"
              value={formObra.desc || ""}
              onChange={handleChangeFormObra}
              disabled={!editarObra}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="En Seguimiento"
            checked={enSeguimiento}
            onChange={handleChangeSeguimiento}
            disabled={!editarObra}
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
                    name="fechaSeg"
                    value={
                      formObra.fechaSeg
                        ? new Date(formObra.fechaSeg).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={handleChangeFormObra}
                    disabled={!editarObra}
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
                    name="descSeg"
                    value={formObra.descSeg || "Sin descripción"}
                    onChange={handleChangeFormObra}
                    disabled={!editarObra}
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
                  disabled={!editarObra}
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
                  disabled={!editarObra}
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
          <Button
            variant="primary"
            className="w-auto px-3 me-2"
            onClick={
              editarObra
                ? () => handleGuardarCambios()
                : () => setEditarObra(true)
            }
          >
            {editarObra ? "Guardar cambios" : "Editar obra"}
          </Button>
          <Button
            variant="danger"
            className="w-auto px-3"
            onClick={
              editarObra
                ? () => handleCancelarCambios()
                : () => handleBajarObra()
            }
          >
            {editarObra ? "Cancelar cambios" : "Baja Obra"}
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
                  value={formObra.tipoObra || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.facturable || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.estadoObra || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={
                    formObra.fechaAlta
                      ? new Date(formObra.fechaAlta).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.usuarioAlta || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={
                    formObra.fechaFin
                      ? new Date(formObra.fechaFin).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
                />
              </Col>
            </Form.Group>

            <div className="d-flex align-items-center mt-3">
              <Form.Check
                type="checkbox"
                label="Ofertado:"
                checked={ofertado}
                onChange={handleChangeOfertado}
                disabled={!editarObra}
                className="me-3"
              />

              {ofertado && (
                <Form.Control
                  type="date"
                  name="fechaOferta"
                  value={
                    formObra.fechaOferta
                      ? new Date(formObra.fechaOferta)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.horasPrevistas || 0}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.gastoPrevisto || 0}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.importe || 0}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.viabilidad || 0}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.empresa || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.contacto || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.edificio || ""}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.observaciones || "Sin observaciones"}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                  value={formObra.observacionesInternas || "Sin observaciones"}
                  onChange={handleChangeFormObra}
                  disabled={!editarObra}
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
                      <td>{`${pedido.codigo_pedido} - ${pedido.posicion}`}</td>
                      <td>
                        {new Date(pedido.fecha).toLocaleDateString("es-Es")}
                      </td>
                      <td>{pedido.importe}</td>
                      <td>
                        {rentabilidadObra
                          ? (rentabilidadObra.ptePedido /
                              rentabilidadObra.pteObra) *
                            100
                          : "No hay datos registrados"}
                      </td>{" "}
                      <td>
                        <p>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleEditarPedido(pedido)}
                            className="me-2"
                          >
                            Detalle
                          </Button>
                        </p>
                        <p>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePedido(pedido.id_pedido)}
                            disabled={!editarObra}
                          >
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

            <p>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleAgregarPedido()}
                className="me-2"
                disabled={!editarObra}
              >
                Nuevo Pedido
              </Button>
            </p>

            <div className="mt-3">
              <strong>Totales</strong>
              <p>Total Importe Pedidos: {totalImportePedidos.toFixed(2)}</p>
              <p>
                % Pedido de la Obra:{" "}
                {((totalImportePedidos / filteredObra.importe) * 100).toFixed(
                  2
                )}
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
                      <td>{`${factura.codigo_pedido} - ${factura.posicion_pedido}`}</td>
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
                          <Button
                            variant="info"
                            onClick={() => handleEditarFactura(factura)}
                            size="sm"
                            className="me-2"
                          >
                            Detalle
                          </Button>
                        </p>
                        <p>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleDeleteFactura(factura.id_factura)
                            }
                            disabled={!editarObra}
                          >
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

            <p>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleAgregarFactura()}
                className="me-2"
                disabled={!editarObra}
              >
                Nueva Factura
              </Button>
            </p>

            <div className="mt-3">
              <strong>Totales</strong>
              <p>Total Importe Facturas: {totalImporteFacturas.toFixed(2)}</p>
              <p>
                % Facturado de la Obra:{" "}
                {((totalImporteFacturas / filteredObra.importe) * 100).toFixed(
                  2
                )}
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
                : "No hay datos registrados"}
            </p>
            <p>
              <strong>Fecha Hora Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaHoraFinal
                  ? new Date(
                      rentabilidadObra.fechaHoraFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos registrados"}
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
                {totalHoras ? Math.round(totalHoras * 100) / 100 : 0}
              </p>
              <p>
                Total Importe Horas:{" "}
                {totalImporteHoras
                  ? Math.round(totalImporteHoras * 100) / 100
                  : 0}
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
                : "No hay datos registrados"}
            </p>
            <p>
              <strong>Fecha Hora Extra Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoFinal
                  ? new Date(
                      rentabilidadObra.fechaGastoFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos registrados"}
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
                : "No hay datos registrados"}
            </p>
            <p>
              <strong>Fecha Gasto Final:</strong>{" "}
              {rentabilidadObra
                ? rentabilidadObra.fechaGastoFinal
                  ? new Date(
                      rentabilidadObra.fechaGastoFinal
                    ).toLocaleDateString("es-Es")
                  : "Sin especificar"
                : "No hay datos registrados"}
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

            {/* LISTADO DE GASTOS DE ALMACEN */}
            {mostrarGastos && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>CodRef.</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Usu</th>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Factura</th>
                    <th>Cant.</th>
                    <th>i.u.</th>
                    <th>Total</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosAlmacenObra.length > 0 ? (
                    movimientosAlmacenObra.map((gasto, idx) => (
                      <tr key={idx}>
                        <td>{gasto.codigo_referencia}</td>
                        <td>{gasto.descripcion_referencia}</td>
                        <td>
                          {new Date(gasto.fecha_alta).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{gasto.codigo_firma}</td>
                        <td>{gasto.tipo_movimiento}</td>
                        <td>{gasto.concepto_movimiento}</td>
                        <td>{gasto.numero_factura ?? "-"}</td>
                        <td>{gasto.cantidad}</td>
                        <td>{gasto.importe}</td>
                        <td>{(gasto.importe * gasto.cantidad).toFixed(2)}</td>
                        <td>
                          <p>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditarGastoAlmacen(gasto)}
                            >
                              Detalle
                            </Button>
                          </p>
                          <p>
                            <Button
                              variant="danger"
                              size="sm"
                              className="me-2"
                              onClick={() => handleDeleteGastoAlmacen(gasto.id)}
                            >
                              Eliminar
                            </Button>
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay gastos de almacén asociados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <p>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleAgregarGastoAlmacen()}
                className="me-2"
                disabled={!editarObra}
              >
                Nuevo Gasto
              </Button>
            </p>

            <div className="mt-3">
              <strong>Totales Almacen</strong>
              <p>
                Total Importe Almacen: {totalImporteMovimientosAlmacen ?? 0}
              </p>
            </div>

            {/* Gastos de Compras */}
            <h5 className="mt-4">Gastos de Compras</h5>

            {/* LISTADO DE LAS FACTURAS DE LAS COMPRAS */}
            {mostrarGastos && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Usu</th>
                    <th>Importe</th>
                    <th>Obs</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasComprasObra.length > 0 ? (
                    facturasComprasObra.map((gasto, idx) => (
                      <tr key={idx}>
                        <td>{`${gasto.Numero} - ${gasto.Concepto}`}</td>
                        <td>
                          {new Date(gasto.fecha_alta).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>{gasto.codigo_firma}</td>
                        <td>{gasto.importe}</td>
                        <td>{gasto.observaciones}</td>
                        <td>
                          <p>
                            <Button
                              variant="info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditarCompra(gasto)}
                            >
                              Detalle
                            </Button>
                          </p>
                          <p>
                            <Button
                              variant="danger"
                              size="sm"
                              className="me-2"
                              onClick={() => handleDeleteCompra(gasto.id)}
                            >
                              Eliminar
                            </Button>
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No hay facturas de compras asociadas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <p>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleAgregarCompra()}
                className="me-2"
                disabled={!editarObra}
              >
                Nueva Compra
              </Button>
            </p>

            <div className="mt-3">
              <strong>Totales Compras</strong>
              <p>Total Importe Compras: {totalImporteCompras ?? 0}</p>
              <p>
                <strong>Total Horas/Gastos</strong>
              </p>
              <p>
                Total Gastos/Horas de la Obra:{" "}
                {(
                  totalImporteHoras +
                  totalImporteHorasExtra +
                  totalImporteGastos
                ).toFixed(2)}
              </p>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {obrasHijasSeleccionadas.length > 0 && (
        <Accordion defaultActiveKey="3">
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              Horas y Gastos Obras Subordinadas
            </Accordion.Header>
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
                <p>
                  Total Cantidad Horas Obras Subordinadas:{" "}
                  {totalHorasSub.toFixed(2)}
                </p>
                <p>
                  Total Importe Horas Obras Subordinadas:{" "}
                  {totalImporteHorasSub.toFixed(2)}
                </p>
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
                <p>
                  Total Cantidad Horas Extra Obras Subordinadas:{" "}
                  {totalHorasExtraSub.toFixed(2)}
                </p>
                <p>
                  Total Importe Horas Extra Obras Subordinadas:{" "}
                  {totalImporteHorasExtraSub.toFixed(2)}
                </p>
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
                            {new Date(
                              gasto.fecha_validacion
                            ).toLocaleDateString("es-ES")}
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
                  {totalImporteGastosSub.toFixed(2)}
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
      )}

      <Accordion defaultActiveKey="4">
        <Accordion.Item eventKey="4">
          <Accordion.Header>Resumen Obra</Accordion.Header>
          <Accordion.Body>
            <div className="mt-3">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <p>
                  <strong>H.Previstas</strong>: {filteredObra.horas_previstas}
                </p>
                <p>
                  <strong>H. Reales</strong>: {totalHoras}
                </p>
                <p>
                  <strong>Gasto Personal (GP)</strong>:{" "}
                  {totalImporteHoras.toFixed(2)}
                </p>
                <p>
                  <strong>H. Totales</strong>: {totalHoras + totalHorasExtra}
                </p>
                <p>
                  <strong>G.Personal Total (GP + GHE)</strong>:{" "}
                  {(totalImporteHoras + totalImporteHorasExtra).toFixed(2)}
                </p>
                <p>
                  <strong>H.Extra</strong>: {totalHorasExtra}
                </p>
                <p>
                  <strong>Gasto H.Extra (GHE)</strong>:{totalImporteHorasExtra}
                </p>
                <p>
                  <strong>Gasto Prev</strong>: {filteredObra.gasto_previsto}
                </p>
                <p>
                  <strong>G.Real (GR)</strong>: {totalImporteGastos}
                </p>
                <p>
                  <strong>G.Almacen (GA)</strong>:{" "}
                  {totalImporteMovimientosAlmacen}
                </p>
                <p>
                  <strong>G.Compras (GC)</strong>: {totalImporteCompras}
                </p>
                <p>
                  <strong>Importe</strong>:{filteredObra.importe}
                </p>
                <p>
                  <strong>Sum P</strong>:{totalImportePedidos.toFixed(2)}
                </p>
                <p>
                  <strong>Sum F</strong>:{totalImporteFacturas.toFixed(2)}
                </p>
                <p>
                  <strong>Pte P</strong>:
                  {((totalImportePedidos / filteredObra.importe) * 100).toFixed(
                    2
                  )}
                </p>
                <p>
                  <strong>Pte F</strong>:
                  {(
                    (totalImporteFacturas / filteredObra.importe) *
                    100
                  ).toFixed(2)}
                </p>
                <p>
                  <strong>G.Total (GP + GR + GHE + GA + GC)</strong>:{" "}
                  {gastoTotal.toFixed(2)}
                </p>
                <p>
                  <strong>Rentabilidad</strong>:{" "}
                  {(filteredObra.importe - gastoTotal).toFixed(2)}
                </p>
                <p>
                  <strong>%Rent</strong>:
                  {filteredObra.importe !== 0
                    ? (
                        ((filteredObra.importe - gastoTotal) * 100) /
                        filteredObra.importe
                      ).toFixed(2)
                    : 0}
                </p>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {obrasHijasSeleccionadas.length > 0 && (
        <Accordion defaultActiveKey="5">
          <Accordion.Item eventKey="5">
            <Accordion.Header>Resumen Obras Subordinadas</Accordion.Header>
            <Accordion.Body>
              <div className="mt-3">
                <div className="mt-3">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <p>
                      <strong>H.Previstas:</strong>
                      {totalHorasPrevistasSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>H.Reales:</strong>
                      {totalHorasSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>G.Personal:</strong>
                      {totalImporteHorasSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>H.Totales:</strong>
                      {(totalHorasSub + totalHorasExtraSub).toFixed(2)}
                    </p>
                    <p>
                      <strong>G.Personal Total (GP + GHE)</strong>:{" "}
                      {(
                        totalImporteHorasSub + totalImporteHorasExtraSub
                      ).toFixed(2)}
                    </p>
                    <p>
                      <strong>H.Extra:</strong>
                      {totalHorasExtraSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Gasto H.Extra:</strong>
                      {totalImporteHorasExtraSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Gasto Prev:</strong>
                      {totalGastosPrevistosSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>G.Real:</strong>
                      {totalImporteGastosSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>G.Almacen: Sin incluir</strong>
                    </p>
                    <p>
                      <strong>G.Compras: Sin incluir</strong>
                    </p>
                    <p>
                      <strong>Importe:</strong>
                      {totalImporteObrasSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Sum P:</strong>
                      {totalImportePedidosSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Sum F:</strong>
                      {totalImporteFacturasSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Pte P:</strong>
                      {(totalImporteObrasSub - totalImportePedidosSub).toFixed(
                        2
                      )}
                    </p>
                    <p>
                      <strong>Pte F:</strong>
                      {(totalImporteObrasSub - totalImporteFacturasSub).toFixed(
                        2
                      )}
                    </p>
                    <p>
                      <strong>G.Total (GP + GR + GHE + GA + GC):</strong>
                      {gastoTotalSub.toFixed(2)}
                    </p>
                    <p>
                      <strong>Rentabilidad</strong>
                      {(totalImporteObrasSub - gastoTotalSub).toFixed(2)}
                    </p>
                    <p>
                      <strong>%Rent:</strong>
                      {totalImporteObrasSub !== 0
                        ? (
                            ((totalImporteObrasSub - gastoTotalSub) * 100) /
                            totalImporteObrasSub
                          ).toFixed(2)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      {obrasHijasSeleccionadas.length > 0 && (
        <Accordion defaultActiveKey="6">
          <Accordion.Item eventKey="6">
            <Accordion.Header>Resumen Obras + Subordinadas</Accordion.Header>
            <Accordion.Body>
              <div className="mt-3">
                <div className="mt-3">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <p>
                      <strong>Importe: </strong>
                      {filteredObra.importe + totalImporteObrasSub}
                    </p>
                    <p>
                      <strong>G.Total:</strong>{" "}
                      {(gastoTotal + gastoTotalSub).toFixed(2)}
                    </p>
                    <p>
                      <strong>Rentabilidad: </strong>
                      {(
                        totalImporteObrasSub -
                        gastoTotalSub +
                        filteredObra.importe -
                        gastoTotal
                      ).toFixed(2)}
                    </p>
                    <p>
                      <strong>%Rent:</strong>{" "}
                      {(
                        ((totalImporteObrasSub -
                          gastoTotalSub +
                          filteredObra.importe -
                          gastoTotal) *
                          100) /
                        (filteredObra.importe + totalImporteObrasSub)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      <Button className="mt-4" onClick={() => navigate(-1)}>
        Volver
      </Button>
      {/* MODAL DE ADICION/EDICION DE PEDIDOS*/}
      <Modal show={showModalPedidos} onHide={() => setShowModalPedidos(false)}>
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>
            {editIDPedido ? "Detalle pedido" : "Nuevo Pedido"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fechaPedido"
                value={
                  formPedidos.fechaPedido
                    ? new Date(formPedidos.fechaPedido)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
                onChange={handleChangeFormPedidos}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Código</Form.Label>
              <Form.Control
                name="codigoPedido"
                value={formPedidos.codigoPedido}
                onChange={handleChangeFormPedidos}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Posicion</Form.Label>
              <Form.Control
                name="posicion"
                type="number"
                value={formPedidos.posicion}
                onChange={handleChangeFormPedidos}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Importe</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={formPedidos.importe}
                onChange={handleChangeFormPedidos}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="observaciones"
                value={formPedidos.observaciones}
                onChange={handleChangeFormPedidos}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalPedidos(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarPedido}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE ADICION/EDICION DE FACTURAS*/}
      <Modal
        show={showModalFacturas}
        onHide={() => setShowModalFacturas(false)}
      >
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>
            {editIDFactura ? "Detalle factura" : "Nueva factura"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Pedido:</Form.Label>
              <Form.Control
                name="idPedido"
                as="select"
                value={formFacturas.idPedido}
                onChange={handleChangeFormFacturas}
              >
                {pedidosObra.length > 0 ? (
                  pedidosObra.map((pedido) => (
                    <option key={pedido.id_pedido} value={pedido.id_pedido}>
                      {`${pedido.codigo_pedido} - ${pedido.posicion}`}
                    </option>
                  ))
                ) : (
                  <option>Cargando pedidos...</option>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha:</Form.Label>
              <Form.Control
                type="date"
                name="fechaFactura"
                value={
                  formFacturas.fechaFactura
                    ? new Date(formFacturas.fechaFactura)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Código:</Form.Label>
              <Form.Control
                name="codigo"
                value={formFacturas.codigo}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Posicion:</Form.Label>
              <Form.Control
                name="posicion"
                type="number"
                value={formFacturas.posicion}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Importe:</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={formFacturas.importe}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Concepto F.:</Form.Label>
              <Form.Control
                name="conceptoFactura"
                value={formFacturas.conceptoFactura}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Concepto L.:</Form.Label>
              <Form.Control
                name="conceptoLinea"
                value={formFacturas.conceptoLinea}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="observaciones"
                value={formFacturas.observaciones}
                onChange={handleChangeFormFacturas}
              />
            </Form.Group>
            <div className="d-flex align-items-center mt-3">
              <Form.Check
                name="cobrado"
                type="checkbox"
                label="Cobrado:"
                checked={formFacturas.cobrado}
                onChange={handleChangeFormFacturas}
                className="me-3"
              />

              {formFacturas.cobrado && (
                <Form.Control
                  type="date"
                  name="fechaCobro"
                  value={
                    formFacturas.fechaCobro
                      ? new Date(formFacturas.fechaCobro)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  onChange={handleChangeFormFacturas}
                />
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalFacturas(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarFactura}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE ADICION/EDICION DE GASTOS DE ALMACEN*/}
      <Modal
        show={showModalGastoAlmacen}
        onHide={() => setShowModalGastoAlmacen(false)}
      >
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>
            {editIDGastoAlmacen ? "Detalle Gasto" : "Nuevo Gasto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Referencia:</Form.Label>

              <div className="mb-2 position-relative">
                <Form.Control
                  type="text"
                  placeholder="Buscar producto por referencia..."
                  value={productoBusqueda}
                  onChange={handleProductoBusqueda}
                  autoComplete="off"
                  disabled={editIDGastoAlmacen}
                />
                {/* Sugerencias productos*/}
                {sugerenciasProductos.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 10 }}
                  >
                    {sugerenciasProductos.map((producto) => (
                      <li
                        key={producto.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => seleccionarProducto(producto)}
                        style={{ cursor: "pointer" }}
                      >
                        {producto.descripcion}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Producto seleccionado */}
                {productoSeleccionado && (
                  <div className="mt-2">
                    <span>
                      <strong>Producto:</strong>{" "}
                      {productoSeleccionado.descripcion}
                    </span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={eliminarProducto}
                      disabled={editIDGastoAlmacen}
                    >
                      Quitar
                    </Button>
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha del movimiento:</Form.Label>
              <Form.Control
                type="date"
                name="fechaAlta"
                value={
                  formGastoAlmacen.fechaAlta
                    ? new Date(formGastoAlmacen.fechaAlta)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
                onChange={handleChangeFormGastoAlmacen}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuario:</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="usuarioAlta"
                  value={formGastoAlmacen.usuarioAlta || ""}
                  onChange={handleChangeFormGastoAlmacen}
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
            <Form.Group>
              <Form.Label>Tipo:</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="tipoMovimiento"
                  value={formGastoAlmacen.tipoMovimiento}
                  disabled={true}
                >
                  <option value="1">[IN] Entrada</option>
                  <option value="2">[OUT] Salida</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Label>Concepto:</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="conceptoMovimiento"
                  value={formGastoAlmacen.conceptoMovimiento}
                  disabled={true}
                >
                  <option value="1">[ALTA] Alta en Almacen</option>
                  <option value="2">[CS] Compra sin Factura</option>
                  <option value="3">[AJUSTE] Ajuste por inventario</option>
                  <option value="4">[DEV] Devolución</option>
                  <option value="5">[OTROS] Otros conceptos</option>
                  <option value="6">[CF] Compra con Factura</option>
                  <option value="7">[OBRA] Asignación a obra</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Label>Obra:</Form.Label>
              <Form.Control
                value={filteredObra.descripcion_obra}
                name="idObra"
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad:</Form.Label>
              <Form.Control
                name="cantidad"
                type="number"
                value={formGastoAlmacen.cantidad}
                onChange={handleChangeFormGastoAlmacen}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Importe unit.:</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={formGastoAlmacen.importe}
                onChange={handleChangeFormGastoAlmacen}
                disabled={editIDGastoAlmacen}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total:</Form.Label>
              <Form.Control
                type="number"
                value={(
                  formGastoAlmacen.cantidad * formGastoAlmacen.importe
                ).toFixed(2)}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="observaciones"
                value={formGastoAlmacen.observaciones}
                onChange={handleChangeFormGastoAlmacen}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalGastoAlmacen(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarGastoAlmacen}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE ADICION/EDICION DE COMPRAS*/}
      <Modal show={showModalCompras} onHide={() => setShowModalCompras(false)}>
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>
            {editIDCompra ? "Detalle Compra" : "Nueva Compra"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Fecha del movimiento:</Form.Label>
              <Form.Control
                type="date"
                name="fechaAlta"
                value={
                  formCompras.fechaAlta
                    ? new Date(formCompras.fechaAlta).toISOString().slice(0, 10)
                    : ""
                }
                onChange={handleChangeFormCompras}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuario:</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="codigoUsuarioAlta"
                  value={formCompras.codigoUsuarioAlta || ""}
                  onChange={handleChangeFormCompras}
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
            <Form.Group className="mb-2">
              <Form.Label>Factura:</Form.Label>

              <div className="mb-2 position-relative">
                <Form.Control
                  type="text"
                  placeholder="Buscar factura por concepto..."
                  value={facturaBusqueda}
                  onChange={handleFacturaBusqueda}
                  autoComplete="off"
                  disabled={editIDCompra}
                />
                {/* Sugerencias productos*/}
                {sugerenciasFacturas.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 10 }}
                  >
                    {sugerenciasFacturas.map((factura) => (
                      <li
                        key={factura.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => seleccionarFactura(factura)}
                        style={{ cursor: "pointer" }}
                      >
                        {factura.Concepto}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Producto seleccionado */}
                {facturaSeleccionada && (
                  <div className="mt-2">
                    <span>
                      <strong>Factura:</strong> {facturaSeleccionada.Concepto}
                    </span>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={eliminarFactura}
                      disabled={editIDCompra}
                    >
                      Quitar
                    </Button>
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Importe:</Form.Label>
              <Form.Control
                name="importe"
                type="number"
                value={formCompras.importe}
                onChange={handleChangeFormCompras}
                disabled={editIDCompra}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                name="observaciones"
                value={formCompras.observaciones}
                onChange={handleChangeFormCompras}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalCompras(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCompras}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );

  //#endregion
};

export default DetalleObra;
