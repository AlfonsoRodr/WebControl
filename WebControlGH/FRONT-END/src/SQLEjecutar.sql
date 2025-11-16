DROP DATABASE IF EXISTS FacturasDB;

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
  descripcion TEXT,
  cantidad INT NOT NULL,
  ubicacion VARCHAR(100)
);

-- Creación de la tabla pedidos
CREATE TABLE pedidos (
	id VARCHAR(255) PRIMARY KEY,
    obra VARCHAR(255) NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    proveedor VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Pendiente', 'Entregado', 'Enviado'),
    importe DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
	referencia VARCHAR(255) NOT NULL,
    observaciones TEXT
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

-- Creación de la tabla obras

CREATE TABLE obras (
	cod VARCHAR(50) PRIMARY KEY,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado ENUM('Pendiente', 'Confirmada','En Progreso'),
    empresa VARCHAR(50) NOT NULL,
    fOferta DATE NOT NULL,
    obs TEXT,
    r INTEGER NOT NULL, -- % Rentabilidad
    pP INTEGER NOT NULL, -- % Pedido de la obra
    fP INTEGER NOT NULL, -- % Facturado de la obra
    fecha_seg DATE,
    horasImputadas INTEGER NOT NULL,
    horasPrevistas INTEGER NOT NULL,
    totalmenteFacturadas BOOL NOT NULL,
    fechaFacturacion DATE
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

INSERT INTO pedidos (id, obra, cliente, proveedor, fecha, estado, importe, concepto, referencia, observaciones) VALUES
	('PED-001', 'Construcción Edificio A', 'Inmobiliaria El Pilar', 'Suministros S.A.', '2024-12-01', 'Pendiente', 12500, 'Materiales de construcción', 'REF-4567', 'Entrega prevista en 10 días'),
    ('PED-002', 'Reforma Local B', 'Comercial Muebles', 'Ferretería Martínez', '2024-12-03', 'Entregado', 3400, 'Herramientas eléctricas', 'REF-7890', ''),
    ('PED-003', 'Instalaciones Industriales C', 'Industria Termotécnica', 'TecnoSuministros', '2024-12-05', 'Enviado', 9000, 'Equipamiento técnico', 'REF-1234', 'Falta confirmar stock'),
    ('PED-004', 'Edificio Corporativo D', 'Grupo Empresarial Omega', 'Construrápido', '2024-12-07', 'Pendiente', 15000, 'Acabados interiores', 'REF-5678', 'Cliente quiere ver muestras');
    
INSERT INTO obras (cod, descripcion, tipo, estado, empresa, fOferta, obs, r, pP, fP, fecha_seg, horasImputadas, horasPrevistas, totalmenteFacturadas, fechaFacturacion) VALUES
('3801R0', 'MANTENIMIENTO PREVENTIVO...', 'Mant.', 'Confirmada', 'Siemens', '2022-05-31', '[-]', 0, 67, 50, NULL, 100, 90, TRUE, '2023-01-01'),
('4319R0', 'GKN DRIVELINE MANTENIMIENTO', 'Mant.', 'Confirmada', 'Siemens', '2024-02-06', '[-]', 100, 100, 0, NULL, 50, 60, TRUE, '2023-01-01'),
('1234R5', 'Otra descripción', 'Tipo X', 'Pendiente', 'Empresa Y', '2023-07-15', '[-]', 80, 90, 10, '2023-07-25', 80, 100, FALSE, NULL),
('2345R6', 'Descripción 1', 'Tipo A', 'En Progreso', 'Empresa Z', '2023-12-12', '[-]', 90, 95, 20, '2024-01-01', 120, 110, FALSE, NULL),
('3456R7', 'Descripción 2', 'Tipo B', 'En Progreso', 'Empresa X', '2023-09-05', '[-]', 85, 80, 30, '2023-09-15', 90, 80, FALSE, NULL),
('9876R5', 'Descripción 95', 'Tipo F', 'Pendiente', 'Empresa Y', '2023-11-20', '[-]', 70, 75, 60, NULL, 60, 70, FALSE, NULL),
('6789R1', 'Descripción 96', 'Tipo C', 'Confirmada', 'Empresa Z', '2023-08-18', '[-]', 95, 90, 25, NULL, 110, 120, TRUE, '2023-01-01'),
('7890R2', 'Descripción 97', 'Tipo D', 'En Progreso', 'Empresa X', '2023-06-22', '[-]', 75, 85, 40, '2023-07-01', 100, 110, FALSE, NULL),
('8901R3', 'Descripción 98', 'Tipo E', 'En Progreso', 'Empresa Y', '2023-10-10', '[-]', 60, 70, 50, NULL, 80, 90, FALSE, NULL),
('9012R4', 'Descripción 99', 'Tipo F', 'Pendiente', 'Empresa Z', '2023-03-05', '[-]', 85, 80, 75, '2023-03-15', 70, 80, FALSE, NULL),
('1123R5', 'Descripción 100', 'Tipo A', 'Pendiente', 'Empresa X', '2023-04-07', '[-]', 95, 85, 80, NULL, 90, 100, FALSE, NULL);
	


