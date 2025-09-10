import React, { useEffect, useState } from "react";
// Este módulo nos permite traer datos desde el componente que ha
// llamado a este componente
import { useLocation } from "react-router-dom";

import axios from "axios";

function ImprimirPedidos() {
  // Estado para los detalles que se van a imprimir
  const [pedidosDetalles, setPedidosDetalles] = useState([]);
  // Estado para mostrar un mensaje de carga mientras se traen los pedidos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar un mensaje de error en la carga de pedidos
  const [error, setError] = useState(null);

  // Objeto location. Accederemos a la propiedad state para sacar los pedidos a imprimir
  const location = useLocation();
  const selectedPedidos = location.state.selectedPedidos;

  // Fetch de los pedidos a imprimir
  const fetchPedidos = async () => {
    try {
      const pedidoPromises = Array.from(selectedPedidos).map(async (id) => {
        const response = await axios.get(`http://localhost:3002/pedidos/${id}`);
        console.log(response.data);
        return { id: id, detalles: response.data };
      });
      const pedidos = await Promise.all(pedidoPromises);
      setPedidosDetalles(pedidos);
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${
            error.response.data.error ||
            "Error al cargar los detalles de los pedidos."
          }`
        );
      } else if (error.request) {
        setError("Error en la solicitud al servidor.");
      } else {
        setError("Error desconocido al cargar los detalles de los pedidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  // UseEffect para cargar los pedidos a imprimir cuando se monte el componente por primera vez
  useEffect(() => {
    fetchPedidos();
  }, [selectedPedidos]);

  if (loading) {
    return <div>Cargando detalles de las facturas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: "18px ", textAlign: "right" }}>
        Pedidos ControlCube
      </h2>
      {pedidosDetalles.map(({ id, detalles }) => (
        <div key={id}>
          <h3 style={{ fontSize: "14px" }}>Detalles del Pedido: {id}</h3>
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
                    backgroundColor: "lightblue",
                  }}
                >
                  Obra
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Cliente
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Proveedor
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Fecha
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Importe
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Concepto
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Referencia
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    backgroundColor: "lightblue",
                  }}
                >
                  Obs.
                </th>
              </tr>
            </thead>
            <tbody>
              {detalles.length > 0 ? (
                detalles.map((detalle) => {
                  return (
                    <tr key={detalle.id}>
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
                        {detalle.cliente}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.proveedor}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.fecha}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.estado}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.importe} €
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.concepto}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.referencia}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {detalle.observaciones}
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
                    No hay detalles disponibles para esta pedido.
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

export default ImprimirPedidos;
