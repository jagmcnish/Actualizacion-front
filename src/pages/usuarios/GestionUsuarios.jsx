import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';

const GestionUsuarios = () => {
    const{data,error,loading} = useQuery(GET_USUARIOS)

    useEffect(() => {
        console.log("data servidor",data)
    }, [data])

    useEffect(() => {
        if(error){
            toast.error('Error al consultar los usuarios');
        }
     }, [error])

    if(loading){ return <div className='text-2xl font-bold text-gray-900'>Cargando...</div>
    }

    return (
        <><nav className="navbar">
            <h1>Gestión de Usuarios</h1>
        </nav>
            <div className='flew flex-col w-full h-full items-center justify-center p-10'>
            <Link to='../usuarios'>
                <i className='fas fa-chevron-circle-left text-blue-400 cursor-pointer font-bold text-xl hover:text-green-400' />
            </Link>
            <div className="table-container">
                <table className="table-list">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Identificación</th>
                            <th>Tipo de Usuario</th>
                            <th>Correo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>                        
                        {data &&
                         data.Usuarios.map((u) => {
                            return(
                                <tr key={u._id}>
                                    <td>{u.nombre}</td>
                                    <td>{u.apellido}</td>
                                    <td>{u.identificacion}</td>
                                    <td>{u.rol}</td>
                                    <td>{u.correo}</td>                                  
                                    <td>{u.estado}</td>
                                    <td>
                                        <Link className="btn-editar" to={`/usuarios/editar/${u._id}`} ><i className="fas fa-user-edit"></i></Link>
                                        <button className="btn-eliminar"><i className="fas fa-user-minus"></i></button> 
                                    </td>
                                </tr>
                            )
                        })}                        
                    </tbody>

                </table>

            </div>
            </div></>
      
    );
};

export default GestionUsuarios