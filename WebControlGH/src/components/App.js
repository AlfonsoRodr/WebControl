import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Importa componentes de navegación
import Login from './Login'; // Importa el componente Login
import Navbar from './Navbar'; // Importa el componente Navbar
import ObrasList from './ObrasList'; // Importa el componente ObrasList
import NuevoObra from './NuevoObra'; // Importa el componente NuevoObra
import ProfitabilityTable from './ProfitabilityTable'; // Importa el componente ProfitabilityTable
import './App.css'; // Importa los estilos globales
import GestionFacturas from './GestionFacturas';
import NuevaFactura from './NuevaFactura';
import NuevoPedido from './NuevoPedido';
import ImprimirFacturas from './ImprimirFacturas'; // Importa el componente ImprimirFactura
import NuevaCompra from './Compra/NuevaCompra';
import GestionAlmacen from './GestionAlmacen';
import GestionPedidos from './GestionPedidos';
import DetalleObra from './DetalleObra';
import DetallePedido from './DetallePedido';
import DetalleFactura from './DetalleFactura';
import GestionCompras from './Compra/GestionCompras';
import DetalleCompra from './DetalleCompra';

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