import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService.js";

// HOOK PERSONALIZADO PARA TODA LA GESTIÓN DE FACTURAS

export const useFacturas = (idObra, pedidos) => {
  // --------------- ESTADOS ------------------- \\

  const [facturas, setFacturas] = useState([]);
  const [facturasHijas, setFacturasHijas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editID, setEditID] = useState(null);
  const [formData, setFormData] = useState({
    idPedido: "",
    codigoPedido: "",
    fechaFactura: new Date(),
    codigo: "",
    posicion: "",
    importe: "",
    conceptoFactura: "",
    conceptoLinea: "",
    observaciones: "",
    idObra: idObra,
    cobrado: false,
    fechaCobro: new Date(),
  });

  // -------------- FETCH DE DATOS ---------------- \\

  const fetchFacturas = async (idsObras, tipo = "Padre") => {
    try {
      const res = await obraService.getFacturas(idsObras);
      tipo === "Padre"
        ? setFacturas(res.data.data)
        : setFacturasHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener facturas (${tipo}) - ${error}`);
    }
  };

  // -------------- HANDLERS ---------------- \\

  const handleAgregar = () => {
    setFormData({
      idPedido: "",
      codigoPedido: "",
      fechaFactura: new Date(),
      codigo: "",
      posicion: "",
      importe: "",
      conceptoFactura: "",
      conceptoLinea: "",
      observaciones: "",
      idObra: idObra,
      cobrado: false,
      fechaCobro: new Date(),
    });
    setEditID(null);
    setShowModal(true);
  };

  const handleEditar = (factura) => {
    setFormData({
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
    setEditID(factura.id_factura);
    setShowModal(true);
  };
  const handleGuardar = async () => {
    if (
      !formData.idPedido ||
      !formData.codigo ||
      !formData.posicion ||
      !formData.importe
    ) {
      return alert("Faltan campos");
    }

    try {
      if (editID) {
        await obraService.updateFactura(editID, formData);
      } else {
        await obraService.createFactura(formData);
      }
      setShowModal(false);
      fetchFacturas([idObra]);
    } catch (error) {
      console.error(`Error al guardar la factura - ${error}`);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta factura?")) {
      try {
        await obraService.deleteFactura(id);
        fetchFacturas([idObra]);
      } catch (error) {
        console.error(`Error al eliminar la factura - ${error}`);
      }
    }
  };

  const handleChangeForm = (e) => {
    if (e.target.type === "checkbox") {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      // Auto-rellenar importe desde pedido seleccionado
      if (e.target.name === "idPedido" && pedidos) {
        const pedidoSeleccionado = pedidos.find(
          (p) => p.id_pedido == e.target.value
        );
        if (pedidoSeleccionado) {
          setFormData((prev) => ({
            ...prev,
            importe: pedidoSeleccionado.importe,
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (idObra) {
      fetchFacturas([idObra]);
    }
  }, [idObra]);

  return {
    facturas,
    facturasHijas,
    showModal,
    setShowModal,
    formData,
    editID,
    handleAgregar,
    handleEditar,
    handleGuardar,
    handleEliminar,
    handleChangeForm,
    fetchFacturas,
  };
};
