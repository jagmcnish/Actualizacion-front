import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';

const IndexUsuarios = () => {
  const { data, error, loading } = useQuery(GET_USUARIOS);

  useEffect(() => {
    if (error) {
      toast.error('Error consultando los usuarios');
    }
  }, [error]);

  if (loading) return <div className='text-2xl font-bold text-gray-900'>Cargando....</div>;

  return (
    <PrivateRoute roleList={['ADMINISTRADOR', 'LIDER']}>
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Usuarios Registrados</h1>
        </div>
        <table className='tabla'>
          <thead>
            <tr>
              <th className="text-center">Nombre</th>
              <th className="text-center">Apellidos</th>
              <th className="text-center">Correo</th>
              <th className="text-center">Identificación</th>
              <th className="text-center">Rol</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Editar</th>
            </tr>
          </thead>
          <tbody>
            {data && data.Usuarios ? (
              <>
                {data.Usuarios.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td className="text-center">{u.nombre}</td>
                      <td className="text-center">{u.apellido}</td>
                      <td className="text-center">{u.correo}</td>
                      <td className="text-center">{u.identificacion}</td>
                      <td className="text-center">{Enum_Rol[u.rol]}</td>
                      <td className="text-center">{Enum_EstadoUsuario[u.estado]}</td>
                      <td className="text-center">
                        <Link to={`/usuarios/editar/${u._id}`}>
                          <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <div>No autorizado</div>
            )}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
};

export default IndexUsuarios;
