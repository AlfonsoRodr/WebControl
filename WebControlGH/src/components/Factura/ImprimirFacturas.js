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
							`http://localhost:3002/api/facturas/${id}`
						);
						console.log({ id: id, detalles: response.data });
						return { id: id, detalles: response.data };
					}
				);
				const detalles = await Promise.all(detallesPromises);
				setFacturasDetalles(detalles);
			} catch (error) {
				if (error.response) {
					setError(
						`Error: ${error.response.status} - ${error.response.data.error ||
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

		fetchDetalles();
	}, [selectedFacturas]);

	if (loading) {
		return <div>Cargando detalles de las facturas...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h2 style={{ fontSize: "18px ", textAlign: "right", color: "white" }}>
				Facturas ControlCube
			</h2>
			{facturasDetalles.map(({ id, detalles }) => (
				<div key={id}>
					<h3 style={{ fontSize: "14px", color: "white" }}>Detalles de la Factura: {id}</h3>
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
									Origen
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Pedido
								</th>
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
									Cpto. F
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Cpto. L
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Impte. Base
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									IVA (%)
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Impte. Iva
								</th>
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Impte. Total
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
								<th
									style={{
										border: "1px solid #ddd",
										padding: "8px",
										textAlign: "center",
										backgroundColor: "lightblue",
									}}
								>
									Cobrado
								</th>
							</tr>
						</thead>
						<tbody>
							{detalles ? (
								(() => {
									console.log(detalles);
									const importeBase = Number(detalles.importe_base || detalles.importe || 0);
									const iva = Number(detalles.iva || 0);
									const importeIva = (importeBase * iva) / 100;
									const importeTotal = Number(detalles.importe || 0);

									return (
										<tr key={id}>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{detalles.codigo_obra || "-"}
											</td>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{detalles.pedido_pos || "-"}
											</td>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{detalles.obra || "-"}
											</td>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{detalles.concepto_f || "-"}
											</td>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{detalles.concepto_l || "-"}
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
												{detalles.obs_imp || detalles.observaciones || "-"}
											</td>
											<td
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
													color: detalles.cobrado ? "green" : "red",
												}}
											>
												{detalles.cobrado ? "Sí" : "No"}
											</td>
										</tr>
									);
								})()
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