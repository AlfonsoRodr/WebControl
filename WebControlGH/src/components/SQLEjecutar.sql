CREATE DATABASE FacturasDB;

-- Seleccionar la base de datos para trabajar en ella
USE FacturasDB;

-- Crear la tabla CabeceraFactura
CREATE TABLE CabeceraFactura (
    cabecera_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    factura_num VARCHAR(50) UNIQUE,
    fecha DATE NOT NULL
);
CREATE TABLE inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL,
  ubicacion VARCHAR(100)
);
-- Creación de la tabla FacturaDetalle con clave foránea compuesta
CREATE TABLE FacturaDetalle (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    origen TEXT NOT NULL,
    pedido_pos INTEGER NOT NULL,
    obra TEXT NOT NULL,
    fecha DATE NOT NULL,
    concepto_f TEXT NOT NULL,
    concepto_l TEXT NOT NULL,
    cobrado BOOLEAN NOT NULL DEFAULT 0,
    importe DECIMAL(10, 2) NOT NULL,
    obs_imp TEXT,
    importe_base DECIMAL(10, 2) NOT NULL,
    iva DECIMAL(4, 2) NOT NULL,

    factura_num VARCHAR(50),
    CONSTRAINT FK_factura_num FOREIGN KEY (factura_num) REFERENCES CabeceraFactura(factura_num)
);

-- INSERT
INSERT INTO CabeceraFactura (factura_num, fecha) VALUES
('FAC001', '2024-01-10'),
('FAC002', '2024-01-12'),
('FAC003', '2024-01-14'),
('FAC004', '2024-01-16'),
('FAC005', '2024-01-18'),
('FAC006', '2024-01-20'),
('FAC007', '2024-01-22');

INSERT INTO FacturaDetalle (origen, pedido_pos, obra, fecha, concepto_f, concepto_l, cobrado, importe, obs_imp, importe_base, iva, factura_num) VALUES
('Proveedor A', 101, 'Obra 1', '2024-01-10', 'Materiales', 'Compra de cemento', 1, 1500.00, 'Pagado a tiempo', 1200.00, 21.00, 'FAC001'),
('Proveedor A', 102, 'Obra 1', '2024-01-10', 'Transporte', 'Transporte de materiales', 1, 250.00, 'Entregado', 200.00, 21.00, 'FAC001'),
('Proveedor B', 103, 'Obra 2', '2024-01-12', 'Mano de obra', 'Servicios de construcción', 0, 1800.00, NULL, 1500.00, 21.00, 'FAC002'),
('Proveedor B', 104, 'Obra 2', '2024-01-12', 'Materiales', 'Compra de ladrillos', 0, 500.00, NULL, 400.00, 21.00, 'FAC002'),
('Proveedor A', 105, 'Obra 1', '2024-01-16', 'Transporte', 'Transporte de equipos', 1, 400.00, 'Pagado', 350.00, 10.00, 'FAC003'),
('Proveedor A', 106, 'Obra 1', '2024-01-16', 'Mano de obra', 'Construcción de base', 0, 800.00, NULL, 700.00, 10.00, 'FAC003'),
('Proveedor D', 107, 'Obra 2', '2024-01-18', 'Mano de obra', 'Servicios adicionales', 0, 2500.00, 'Pendiente', 2100.00, 10.00, 'FAC004'),
('Proveedor C', 108, 'Obra 3', '2024-01-20', 'Materiales', 'Compra de cemento', 1, 1200.00, 'Pagado', 1000.00, 21.00, 'FAC005'),
('Proveedor A', 109, 'Obra 4', '2024-01-22', 'Transporte', 'Transporte de materiales', 1, 300.00, 'Entregado', 250.00, 21.00, 'FAC006'),
('Proveedor C', 110, 'Obra 5', '2024-01-24', 'Mano de obra', 'Construcción de base', 1, 2200.00, 'Pagado', 1800.00, 21.00, 'FAC007');

INSERT INTO inventario (id, nombre, descripcion, cantidad, ubicacion) VALUES
(1, 'Cemento Portland', 'Saco de cemento de 25kg', 120, 'Almacén Central A1'),
(2, 'Ladrillo hueco', 'Palet de ladrillos huecos 40x20', 75, 'Zona Exterior B2'),
(3, 'Tubo PVC 110mm', 'Tubo de PVC para saneamiento', 300, 'Pasillo C3'),
(4, 'Pintura Blanca', 'Bote de pintura 15L', 40, 'Almacén Central A4'),
(5, 'Cable Eléctrico 3x2.5', 'Rollo de cable eléctrico de 50m', 55, 'Zona Técnica D1');

