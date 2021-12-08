import { useUser } from 'context/userContext';
import React from 'react';

const PrivateRoute = ({ roleList, children }) => {
  const { userData } = useUser();

  if (roleList.includes(userData.rol)) {
    return children;
  }

  return <div className='text-9xl text-red-100 '>No posee permisos para este contenido.</div>;
};

export default PrivateRoute;
