// ESTE ARCHIVO TIENE TODAS LAS LLAMADAS A LAS APIs que necesita el módulo Obra

import axios from "axios";

const BASE_URL = "http://localhost:3002/api";

export const obraService = {
  // OBRA
  getObra: (idObra) => axios.get(`${BASE_URL}/obra/${idObra}`),
  getAllObras: () => axios.get(`${BASE_URL}/obra`),
  createObra: (data) => axios.post(`${BASE_URL}/obra`, data),
  updateObra: (idObra, data) => axios.put(`${BASE_URL}/obra/${idObra}`, data),
  deleteObra: (idObra) => axios.delete(`${BASE_URL}/obra/${idObra}`),
  buscarObrasPorDescripcion: (descripcion) =>
    axios.get(
      `${BASE_URL}/obra/buscar/descripcion?descripcionObra=${descripcion}`
    ),

  // RENTABILIDAD
  getRentabilidad: (idObra) => axios.get(`${BASE_URL}/rentabilidad/${idObra}`),

  // FACTURAS
  getFacturas: (idsObras) =>
    axios.post(`${BASE_URL}/ecoFactura/buscar`, { idsObras }),
  createFactura: (data) => axios.post(`${BASE_URL}/ecoFactura`, data),
  updateFactura: (id, data) => axios.put(`${BASE_URL}/ecoFactura/${id}`, data),
  deleteFactura: (id) => axios.delete(`${BASE_URL}/ecoFactura/${id}`),

  // PEDIDOS
  getPedidos: (idsObras) =>
    axios.post(`${BASE_URL}/ecoPedido/buscar`, { idsObras }),
  createPedido: (data) => axios.post(`${BASE_URL}/ecoPedido`, data),
  updatePedido: (id, data) => axios.put(`${BASE_URL}/ecoPedido/${id}`, data),
  deletePedido: (id) => axios.delete(`${BASE_URL}/ecoPedido/${id}`),

  // GASTOS
  getGastos: (idsObra) => axios.post(`${BASE_URL}/gastos/buscar`, { idsObra }),

  // HORAS
  getHoras: (idsObra) => axios.post(`${BASE_URL}/horas/buscar`, { idsObra }),
  getHorasExtra: (idsObra) =>
    axios.post(`${BASE_URL}/gastos/horas-extra/buscar`, { idsObra }),

  // RELACIONES OBRA
  getObraPadre: (idObra) =>
    axios.get(`${BASE_URL}/relacion-obras/padre/${idObra}`),
  getObrasHijas: (idObra) =>
    axios.get(`${BASE_URL}/relacion-obras/hijas/${idObra}`),
  setObraPadre: (data) => axios.post(`${BASE_URL}/relacion-obras/padre`, data),
  setObrasHijas: (data) => axios.post(`${BASE_URL}/relacion-obras/hijas`, data),

  // DESPLEGABLES
  getTiposObra: () => axios.get(`${BASE_URL}/tipo-obra`),
  getTiposFacturables: () => axios.get(`${BASE_URL}/tipo-facturable`),
  getEstadosObra: () => axios.get(`${BASE_URL}/estado-obra`),
  getUsuarios: () => axios.get(`${BASE_URL}/usuario`),
  getEmpresas: () => axios.get(`${BASE_URL}/empresa`),
  getEdificios: () => axios.get(`${BASE_URL}/edificio`),
  getContactosEmpresa: (idEmpresa) =>
    axios.get(`${BASE_URL}/contacto/${idEmpresa}`),

  // ALMACEN
  getMovimientosAlmacen: (idObra) =>
    axios.get(`${BASE_URL}/movimientos-almacen/obra/${idObra}`),
  createMovimientoAlmacen: (data) =>
    axios.post(`${BASE_URL}/movimientos-almacen`, data),
  updateMovimientoAlmacen: (id, data) =>
    axios.put(`${BASE_URL}/movimientos-almacen/${id}`, data),
  deleteMovimientoAlmacen: (id) =>
    axios.delete(`${BASE_URL}/movimientos-almacen/${id}`),
  buscarProductos: (descripcion) =>
    axios.get(
      `${BASE_URL}/almacen/buscar/descripcion?descripcion=${descripcion}`
    ),

  // COMPRAS
  getFacturasCompras: (idObra) =>
    axios.get(`${BASE_URL}/facturas/obra/${idObra}`),
  createFacturaCompra: (data) => axios.post(`${BASE_URL}/facturas`, data),
  updateFacturaCompra: (id, data) =>
    axios.patch(`${BASE_URL}/facturas/${id}`, data),
  deleteFacturaCompra: (id) => axios.delete(`${BASE_URL}/facturas/${id}`),
  buscarFacturas: (concepto) =>
    axios.get(`${BASE_URL}/facturas/buscar/concepto?concepto=${concepto}`),
};
