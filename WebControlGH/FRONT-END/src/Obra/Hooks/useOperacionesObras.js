import { useNavigate } from "react-router-dom";
import { obraService } from "../Services/obraService.js";
import { normalizarFecha } from "../Utils/fechas.js";

export const useOperacionesObras = (
  fetchObras,
  clearSelections,
  setCurrentPage,
  setObraFacturadaSelec
) => {
  const navigate = useNavigate();

  const handleAgregarObra = () => {
    setCurrentPage(1);
    navigate("/home/nuevo-obra");
  };

  const handleFinalizarObra = async (idObra) => {
    const update = { estadoObra: 4 }; // Corresponde con el estado Finalizada (No debería estar hardcodeado)
    try {
      await obraService.updateObra(idObra, update);
      fetchObras();
      setObraFacturadaSelec(null);
    } catch (error) {
      console.error(`Error al finalizar la obra - ${error}`);
    }
  };

  const deleteObra = async (selectedObras) => {
    try {
      const deletePromises = Array.from(selectedObras).map(async (id) => {
        await obraService.deleteObra(id);
      });
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error(
        "Error al dar de baja las obras:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const handleBajaObras = async (selectedObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para dar de baja");
      return;
    }
    if (
      window.confirm("¿Estás seguro de dar de baja las obras seleccionadas?")
    ) {
      try {
        const success = await deleteObra(selectedObras);
        if (success) {
          await fetchObras();
          clearSelections();
          alert("Obras dadas de baja correctamente");
        } else {
          alert("Error al dar de baja las obras seleccionadas");
        }
      } catch (error) {
        console.error(`Error en el proceso de dar de baja - ${error}`);
      }
    }
  };

  const copiarObra = async (selectedObras, allObras) => {
    try {
      const copyPromises = Array.from(selectedObras).map(async (id) => {
        const obra = allObras.filter((obra) => obra.id_obra === id)[0];
        const data = {
          cod: obra.codigo_obra,
          desc: obra.descripcion_obra,
          fechaSeg: normalizarFecha(obra.fecha_seg),
          descSeg: obra.descripcion_seg,
          tipoObra: obra.tipo_obra,
          facturable: obra.facturable,
          estadoObra: obra.estado_obra,
          fechaAlta: normalizarFecha(obra.fecha_alta),
          usuarioAlta: obra.codigo_usuario_alta,
          fechaFin: normalizarFecha(obra.fecha_prevista_fin),
          fechaOferta: normalizarFecha(obra.fecha_oferta),
          horasPrevistas: obra.horas_previstas,
          gastoPrevisto: obra.gasto_previsto,
          importe: obra.importe,
          viabilidad: obra.viabilidad,
          empresa: obra.id_empresa,
          contacto: obra.id_contacto,
          edificio: obra.id_edificio,
          observaciones: obra.observaciones,
          observacionesInternas: obra.observaciones_internas,
        };
        await obraService.createObra(data);
      });
      await Promise.all(copyPromises);
      return true;
    } catch (error) {
      console.error(`Error al copiar las obras - ${error}`);
      return false;
    }
  };

  const handleCopiarObras = async (selectedObras, allObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para copiar.");
      return;
    }
    try {
      const success = await copiarObra(selectedObras, allObras);
      if (success) {
        await fetchObras();
        clearSelections();
        alert("Obras copiadas correctamente");
      } else {
        alert("Error al copiar las obras");
      }
    } catch (error) {
      console.error("Error en el proceso de copiado de obras", error);
    }
  };
  const handleImprimirObras = (selectedObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para imprimir.");
      return;
    }
    navigate("/home/imprimir-obra", {
      state: { selectedObras: selectedObras },
    });
  };

  return {
    handleAgregarObra,
    handleFinalizarObra,
    handleBajaObras,
    handleCopiarObras,
    handleImprimirObras,
  };
};
