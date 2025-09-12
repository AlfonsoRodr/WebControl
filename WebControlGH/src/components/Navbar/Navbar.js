import React, { useState } from 'react'; // Importa React y el hook useState
import { useNavigate, Link } from 'react-router-dom'; // Importa el hook useNavigate para la navegación
import '../../css/Navbar.css'; // Importa los estilos específicos de Navbar

// Componente Navbar
function Navbar() {
  const [showSubMenu, setShowSubMenu] = useState({ obras: false, horas: false, calidad: false, config: false });
  const navigate = useNavigate();

  // Función para alternar la visibilidad de los submenús
  const toggleSubMenu = (menu) => {
    setShowSubMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional para manejar el logout, como limpiar el estado global o local.
    navigate('/login'); // Usa 'navigate' para redirigir al usuario
  };

  return (
    <nav>
      <div className="nav-content">

        {/* Contenedor para el logo y el botón de desconectar */}
        <div className="header-section">
          <div className="logo">Control Cube</div>
          <button className="logout-button" onClick={handleLogout}>Desconectar</button>
        </div>

        <div className="menu-items">
          <div onMouseEnter={() => toggleSubMenu('obras')} onMouseLeave={() => toggleSubMenu('obras')}>
            Obras
            {showSubMenu.obras && (
              <div className="submenu">
                <Link to="/home/gestion-obras">Gestión de Obras</Link>
                <Link to="/home/profitability">Rentabilidad/Viabilidad</Link>
                <Link to="/home/gestion-facturas">Gestión de Facturas</Link>
                <Link to="/home/gestion-pedidos">Gestión de Pedidos</Link>
                <Link to="/home/gestion-documental">Gestión Documental</Link>
              </div>
            )}
          </div>

          <div onMouseEnter={() => toggleSubMenu('horas')} onMouseLeave={() => toggleSubMenu('horas')}>
            Horas
            {showSubMenu.horas && (
              <div className="submenu">
                <a href="#registro-horas">Horas</a>
                <a href="#control-horas">Planificación</a>
              </div>
            )}
          </div>
          <a href="#gastos">Gastos</a>

          <a href="#compras">Gestión de SAT</a>

          <Link to="/home/gestion-compras">Compras</Link>

          <Link to="/home/gestion-almacen">Gestión de Almacén</Link>

          <div onMouseEnter={() => toggleSubMenu('calidad')} onMouseLeave={() => toggleSubMenu('calidad')}>
            Gestión Calidad
            {showSubMenu.calidad && (
              <div className="submenu">
                <a href="#control-calidad">Incidencias / Acción correctiva</a>
                <a href="#auditorias">Accion mejora / preventiva</a>
              </div>
            )}
          </div>
        
          <div onMouseEnter={() => toggleSubMenu('config')} onMouseLeave={() => toggleSubMenu('config')}>
            Configuración
            {showSubMenu.config && (
              <div className="submenu">
                <a href="#usuarios">Gestión de Usuarios</a>
                <a href="#roles">Gestión de Empresas</a>
                <a href="#permisos">Gestión de Proveedores</a>
                <a href="#sistema">Gestión de Complejos</a>
                <a href="#red">Gestión de Contactos</a>
                <a href="#seguridad">Gestión de Tipos de gasto</a>
                <a href="#datos">Gestión de Tareas</a>
                <a href="#backup">Gestión de Calendarios</a>
                <a href="#actualizaciones">Configuración Variables</a>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </nav>
  );
}

export default Navbar; // Exporta el componente Navbar como predeterminado