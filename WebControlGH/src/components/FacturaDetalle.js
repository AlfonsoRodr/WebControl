import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './FacturaDetalle.css';

function FacturaDetalle() {
    const { facturaNum } = useParams();
    const [facturaCabecera, setFacturaCabecera] = useState(null);
    const [facturaDetalles, setFacturaDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cabeceraResponse = await axios.get(`/facturas/${facturaNum}`);
                setFacturaCabecera(cabeceraResponse.data);

                const detallesResponse = await axios.get(`/facturas/${facturaNum}/detalles`);
                setFacturaDetalles(detallesResponse.data);
            } catch (error) {
                if (error.response) {
                    setError(`Error: ${error.response.status} - ${error.response.data.error || "Error al cargar la factura."}`);
                } else if (error.request) {
                    setError("Error en la solicitud al servidor.");
                } else {
                    setError("Error desconocido al cargar la factura.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [facturaNum]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!facturaCabecera) {
        return <div>No se encontraron detalles para esta factura.</div>;
    }

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const year = String(date.getFullYear()).slice(-2); // Obtiene los últimos 2 dígitos del año
        return `${day}/${month}/${year}`;
    };

    // Función para formatear números
    const formatNumber = (num) => {
        const formatted = num.toFixed(2);
        return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted; // Elimina .00 si es un entero
    };

    // Calcular el importe total de todas las líneas
    const totalImporte = facturaDetalles.reduce((acc, detalle) => acc + Number(detalle.importe_base), 0);
    const totalIVA = facturaDetalles.reduce((acc, detalle) => acc + (Number(detalle.importe_base) * Number(detalle.iva) / 100), 0);
    const totalConIVA = totalImporte + totalIVA;

    // Sumar los importes totales de cada línea
    const totalImporteTotal = facturaDetalles.reduce((acc, detalle) => acc + Number(detalle.importe_total), 0);

    return (
        <div className="gestion-facturas-container">
            <h2>Detalles de la Factura: {facturaNum}</h2>
            <h3>Cabecera de Factura</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Número de Factura</th>
                        <td>{facturaCabecera.factura_num}</td>
                    </tr>
                    <tr>
                        <th>Fecha</th>
                        <td>{formatDate(facturaCabecera.fecha_cabecera)}</td> {/* Formatear la fecha */}
                    </tr>
                    <tr>
                        <th>Importe Total</th>
                        <td>{formatNumber(totalConIVA)} €</td> {/* Formato a 2 decimales */}
                    </tr>
                </tbody>
            </table>

            <h3>Líneas de Factura</h3>
            <table>
                <thead>
                    <tr>
                        <th>Origen</th>
                        <th>Pedido Pos</th>
                        <th>Obra</th>
                        <th>Concepto F</th>
                        <th>Concepto L</th>
                        <th>Importe Base</th>
                        < th>IVA (%)</th>
                        <th>Importe Iva</th>
                        <th>Importe Total</th>
                        <th>Observaciones</th>
                        <th>Cobrado</th>
                    </tr>
                </thead>
                <tbody>
                    {facturaDetalles.length > 0 ? (
                        facturaDetalles.map((detalle) => {
                            const importeBase = Number(detalle.importe_base);
                            const iva = Number(detalle.iva);
                            const importeIva = (importeBase * iva / 100);
                            const importeTotal = importeBase + importeIva;

                            return (
                                <tr key={detalle.id}>
                                    <td>{detalle.origen}</td>
                                    <td>{detalle.pedido_pos}</td>
                                    <td>{detalle.obra}</td>
                                    <td>{detalle.concepto_f}</td>
                                    <td>{detalle.concepto_l}</td>
                                    <td>{formatNumber(importeBase)} €</td>
                                    <td>{iva}</td>
                                    <td>{formatNumber(importeIva)} €</td>
                                    <td>{formatNumber(importeTotal)} €</td>
                                    <td>{detalle.obs_imp}</td>
                                    <td style={{ color: detalle.cobrado ? 'green' : 'red' }}> {detalle.cobrado ? "Sí" : "No"}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="11">No hay detalles disponibles para esta factura.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default FacturaDetalle;