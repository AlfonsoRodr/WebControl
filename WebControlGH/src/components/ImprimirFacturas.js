import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";

function ImprimirFacturas() {
  const [facturasDetalles, setFacturasDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const selectedFacturas = location.state.selectedFacturas;
  console.log("ImprimirFacturas: Facturas para imprimir", selectedFacturas);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const detallesPromises = Array.from(selectedFacturas).map(
          async (id) => {
            console.log("Id factura", id);
            const response = await axios.get(
              `http://localhost:3002/facturas/${id}/detalles`
            );
            return { id: id, detalles: response.data };
          }
        );
        const detalles = await Promise.all(detallesPromises);
        setFacturasDetalles(detalles);
      } catch (error) {
        if (error.response) {
          setError(
            `Error: ${error.response.status} - ${
              error.response.data.error ||
              "Error al cargar los detalles de las facturas."
            }`
          );
        } else if (error.request) {
          setError("Error en la solicitud al servidor.");
        } else {
          setError("Error desconocido al cargar los detalles de las facturas.");
        }
      } finally {
        setLoading(false);
      }
    };
    console.log(selectedFacturas.length);

    if (selectedFacturas.length > 0) {
      fetchDetalles();
    }
  }, [selectedFacturas]);

  if (loading) {
    return <div>Cargando detalles de las facturas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: "18px ", textAlign: "right" }}>
        Facturas ControlCube
      </h2>
      {facturasDetalles.map(({ id, detalles }) => (
        <div key={id}>
          <h3 style={{ fontSize: "14px" }}>Detalles de la Factura: {id}</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Origen
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Pedido
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Obra
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Cpto. F
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Cpto. L
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Impte. Base
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  IVA (%)
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Impte. Iva
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Impte. Total
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Obs.
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Cobrado
                </th>
              </tr>
            </thead>
            <tbody>
              {detalles.length > 0 ? (
                detalles.map((detalle) => {
                  console.log(detalle);
                  const importeBase = Number(detalle.importe_base);
                  const iva = Number(detalle.iva);
                  const importeIva = (importeBase * iva) / 100;
                  const importeTotal = Number(detalle.importe);

                  return (
                    <tr key={detalle.id}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.origen}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.pedido_pos}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.obra}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.concepto_f}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.concepto_l}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {importeBase.toFixed(2)} €
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {iva}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {importeIva.toFixed(2)} €
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {importeTotal.toFixed(2)} €
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.obs_imp}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          color: detalle.cobrado ? "green" : "red",
                        }}
                      >
                        {detalle.cobrado ? "Sí" : "No"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      textAlign: "center",
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    No hay detalles disponibles para esta factura.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ImprimirFacturas;
