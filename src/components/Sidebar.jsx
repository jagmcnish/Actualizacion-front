import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'context/authContext';
import PrivateComponent from './PrivateComponent';

const SidebarLinks = () => {
  return (
    <ul className='mt-1'>
      <SidebarRoute to='' title='Inicio' icon='fas fa-home' />

      <SidebarRoute to='/proyectos' title='Proyectos' icon='fas fa-laptop' />

      <SidebarRoute to='/avances' title='Avances' icon='fas fa-tasks' />

      <SidebarRoute to='/inscripciones' title='Inscripciones' icon='fas fa-book-reader' />
          
      <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
      <SidebarRoute to='/usuarios' title='Usuarios' icon='fas fa-address-card' />
      </PrivateComponent>
      
      <Logout />
    </ul>
  );
};

const Logout = () => {
  const { setToken } = useAuth();
  const deleteToken = () => {
    console.log('eliminar token');
    setToken(null);
  };
  return (
    <li onClick={() => deleteToken()}>
      <NavLink to='/auth/login' className='sidebar-route text-red-700'>
        <div className='flex items-center'>
          <i className='fas fa-door-open' />
          <span className='text-sm  ml-2'>Salida</span>
        </div>
      </NavLink>
    </li>
  );
};

const Logo = () => {
  return (
    <div className='py-3 w-full flex flex-col items-center justify-center'>
      <img src='logo.png' alt='Logo' className='h-13' />
      <span className='my-2 text-xl font-bold text-center'>Administración Documentos</span>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className='flex flex-col md:flex-row flex-no-wrap md:h-full'>
      {/* Sidebar starts */}

      <div className='sidebar hidden md:flex'>
        <div className='px-9'>
          <Logo />
          <SidebarLinks />
        </div>
      </div>
      <div className='flex md:hidden w-full justify-between bg-gray-900 p-3 text-white'>
        <i className={`fas fa-${open ? 'times' : 'bars'}`} onClick={() => setOpen(!open)} />
        <i className='fas fa-home' />
      </div>
      {open && <ResponsiveSidebar />}
      {/* Sidebar ends */}
    </div>
  );
};

const ResponsiveSidebar = () => {
  return (
    <div>
      <div
        className='sidebar h-full z-40 absolute md:h-full sm:hidden transition duration-150 ease-in-out'
        id='mobile-nav'
      >
        <div className='px-9'>
          <Logo />
          <SidebarLinks />
        </div>
      </div>
    </div>
  );
};

const SidebarRoute = ({ to, title, icon }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? 'sidebar-route text-white bg-green-700'
            : 'sidebar-route text-gray-900 hover:text-white hover:bg-green-400'
        }
      >
        <div className='flex items-center'>
          <i className={icon} />
          <span className='text-sm  ml-2'>{title}</span>
        </div>
      </NavLink>
    </li>
  );
};

export default Sidebar;
