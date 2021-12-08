import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AVANCES } from 'graphql/avances/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';

const IndexAvances = () => {
  const { data, error, loading } = useQuery(GET_AVANCES);

  useEffect(() => {
    if (error) {
      toast.error('Error consultando Avances');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={['ADMINISTRADOR']}>
      <div className= 'p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
      <h1 className=' text-2xl font-bold text-gray-900 '>Avances Realizados</h1>
      </div>
        <table className='tabla'>
          <thead>
            <tr>
              <th>ID Avance</th>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th>Observaciones</th>
              <th>Proyecto</th>
              <th>Creado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {data && data.Avances ? (
              <>
                {data.Avances.map((a) => {
                  return (
                    <tr key={a._id}>
                      <td>{a.fecha}</td>
                      <td>{a.descripcion}</td>
                      <td>{a.observaciones}</td>
                      <td>{a.proyecto}</td>
                      <td>{a.creadoPor}</td>
                      <td>
                        <Link to={`/avances/editar${a._id}`}>
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
export default IndexAvances;
