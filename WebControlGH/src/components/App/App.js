import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import '../../css/App.css'; 

// -- LOGIN -- \\
import Login from '../Login/Login'; 
// -- NAVBAR -- \\
import Navbar from '../Navbar/Navbar'; 

// -- TABLA RENTABILIDAD -- \\
import ProfitabilityTable from '../Rentabilidad/ProfitabilityTable'; 

// -- ALMACEN -- \\
import GestionAlmacen from '../Almacen/GestionAlmacen';

// -- OBRA -- \\
import ObrasList from '../Obra/ObrasList'; 
import DetalleObra from '../Obra/DetalleObra';
import NuevoObra from '../Obra/NuevoObra';

// -- FACTURA -- \\
import GestionFacturas from '../Factura/GestionFacturas';
import DetalleFactura from '../Factura/DetalleFactura';
import NuevaFactura from '../Factura/NuevaFactura';
import ImprimirFacturas from '../Factura/ImprimirFacturas';

// -- PEDIDO -- \\
import GestionPedidos from '../Pedido/GestionPedidos';
import DetallePedido from '../Pedido/DetallePedido';
import NuevoPedido from '../Pedido/NuevoPedido';
import ImprimirPedidos from '../Pedido/ImprimirPedido'; 

// -- COMPRA -- \\
import GestionCompras from '../Compra/GestionCompras';
import DetalleCompra from '../Compra/DetalleCompra';
import NuevaCompra from '../Compra/NuevaCompra';

// Componente principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <div className="app-container"> {/* Usa una clase del CSS global */}
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<MainLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Componente de diseño principal que contiene la barra de navegación y las rutas internas
function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="gestion-obras" element={<ObrasList />} />
          <Route path="nuevo-obra" element={<NuevoObra />} />
          <Route path="nueva-factura" element={<NuevaFactura />} />
          <Route path="nuevo-pedido" element={<NuevoPedido />} />
          <Route path="nueva-compra" element={<NuevaCompra />} />
          <Route path="profitability" element={<ProfitabilityTable />} />
          <Route path="gestion-facturas" element={<GestionFacturas />} />  
          <Route path="gestion-facturas/detalle/:cod" element={<DetalleFactura />} /> 
          <Route path="gestion-compras/detalle/:numero" element={<DetalleCompra />} />
          <Route path="gestion-pedidos/detalle/:id" element={<DetallePedido />} />     
          <Route path="imprimir-factura" element={<ImprimirFacturas />} /> {/* Nueva ruta para imprimir facturas */}
          <Route path="imprimir-pedido" element={<ImprimirPedidos />} />
          <Route path="gestion-almacen" element={<GestionAlmacen />} /> 
          <Route path="gestion-pedidos" element={<GestionPedidos />} /> 
          <Route path="gestion-compras" element={<GestionCompras />} /> 
          <Route path="gestion-obras/detalle/:cod" element={<DetalleObra />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default App; // Exporta el componente App como predeterminado