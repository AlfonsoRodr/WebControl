import { useState, useEffect } from "react";
import { obraService } from "../Services/obraService.js";

// HOOK PERSONALIZADO PARA TODA LA GESTIÓN DE PEDIDOS

export const usePedidos = (idObra) => {
  // ------------ ESTADOS ------------- \\

  const [pedidos, setPedidos] = useState([]);
  const [pedidosHijas, setPedidosHijas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editID, setEditID] = useState(null);
  const [formData, setFormData] = useState({
    fechaPedido: "",
    codigoPedido: "",
    posicion: "",
    importe: "",
    observaciones: "",
    idObra: "",
  });

  // ----------- FETCH DE DATOS ---------- \\

  const fetchPedidos = async (idsObras, tipo = "Padre") => {
    try {
      const res = await obraService.getPedidos(idsObras);
      tipo === "Padre"
        ? setPedidos(res.data.data)
        : setPedidosHijas(res.data.data);
    } catch (error) {
      console.error(`Error al obtener pedidos (${tipo}) - ${error}`);
    }
  };

  // ----------- HANDLERS ----------- \\

  const handleAgregar = () => {
    setFormData({
      fechaPedido: new Date(),
      codigoPedido: "",
      posicion: "",
      importe: "",
      observaciones: "",
      idObra: idObra,
    });
    setEditID(null);
    setShowModal(true);
  };

  const handleGuardar = async () => {
    // TODO: AÑADIR VALIDACIONES DE LOS CAMPOS
    if (
      !formData.codigoPedido ||
      !formData.fechaPedido ||
      !formData.importe ||
      !formData.posicion
    ) {
      return alert("Faltan campos");
    }
    try {
      if (editID) {
        await obraService.updatePedido(editID, formData);
      } else {
        await obraService.createPedido(formData);
      }
      setShowModal(false);
      fetchPedidos([idObra], "Padre");
    } catch (error) {
      console.error(`Error al guardar el pedido - ${error}`);
    }
  };

  const handleEditar = (pedido) => {
    setFormData({
      fechaPedido: pedido.fecha,
      codigoPedido: pedido.codigo_pedido,
      posicion: pedido.posicion,
      importe: pedido.importe,
      observaciones: pedido.observaciones,
    });
    setEditID(pedido.id_pedido);
    setShowModal(true);
  };

  // Función para eliminar un pedido
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await obraService.deletePedido(id);
        fetchPedidos([idObra]);
      } catch (error) {
        console.error(`Error al eliminar el pedido - ${error}`);
      }
    }
  };

  const handleChangeForm = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (idObra) {
      fetchPedidos([idObra]);
    }
  }, [idObra]);

  return {
    pedidos,
    pedidosHijas,
    showModal,
    setShowModal,
    formData,
    editID,
    handleAgregar,
    handleEditar,
    handleGuardar,
    handleEliminar,
    handleChangeForm,
    fetchPedidos,
  };
};
