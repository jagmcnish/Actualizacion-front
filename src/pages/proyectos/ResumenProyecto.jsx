import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import { GET_PROYECTOS, GET_PROYECTOS_LIDERADOS } from 'graphql/proyectos/queries';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import ModalObj from 'components/ModalObj';
import ModalAvan from 'components/ModalAvan';
import ModalInscrip from 'components/ModalInscrip'
import {Enum_TipoObjetivo} from './../.././utils/enums'
import useFormData from 'hooks/useFormData';
import { useUser } from "context/userContext";
import { Enum_EstadoInscripcion} from 'utils/enums';


const IndexProyectos = () => {

  const { userData } = useUser();

  const{data, error, loading}=useQuery(GET_PROYECTOS);

  const{data: dataLideres, error: errorLideres, loading: loadingLideres}=useQuery(GET_PROYECTOS_LIDERADOS, {
    variables: {
      idLider: userData._id,
    },
  });

  useEffect(()=>{
    console.log('datos de los proyectos Liderados', dataLideres);
  }, [dataLideres]); 

  useEffect(()=>{
    if(error || errorLideres){
      toast.error('error consultando los proyectos')
    }
  },[error])

  if (loading || loadingLideres) return <div className='text-2xl font-bold text-gray-900'>Cargando...</div>

  return (
  <div className='p-10 flex flex-col'>
      <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Resumen de Proyectos</h1>
        </div>
        <div>
            <button className='bg-green-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-green-400'>
              <Link to='/proyectos'> Atras </Link>
        </button></div>
        
    {userData.rol=='ADMINISTRADOR' || userData.rol=='ESTUDIANTE'?

    
    <div className='flew flex-col w-full h-full items-center justify-center p-10'>
    <table className='tabla' >
        <thead>
          <tr>
          
            <th className="text-center">Nombre</th>
            <th className="text-center">Presupuesto</th>
            <th className="text-center">fechaInicio</th>
            <th className="text-center">Estado </th>
            <th className="text-center">Fase </th>
            <th className="text-center">Objetivos</th>
            <th className="text-center">Avances</th>
            <th className="text-center">Estado Inscripcion</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.Proyectos.map((u) => {
              
              return (
                
                <tr key={u._id}>
                  <td className="text-center">{u.nombre}</td>
                  <td className="text-center">{u.presupuesto}</td>
                  <td className="text-center">{u.fechaInicio}</td>
                  <td className="text-center">{u.estado}</td>
                  <td className="text-center">{u.fase}</td>
               
                  <td key={u._id}><ModalObj id={`exampleModelObjetivos-${u._id}`} objetivos={u.
                    objetivos}></ModalObj>
                  </td>

                  <td key={u._id}><ModalAvan id={`exampleModalAvances-${u._id}`}  avances={u.avances}></ModalAvan>
                  </td>

                   <td key={u._id}><ModalInscrip id={`exampleModalInscrip-${u._id}`}  inscripciones={Enum_EstadoInscripcion[u.inscripcion]}></ModalInscrip>
                  </td>
            
                </tr>
                
              );
              
            })}
        </tbody>
      </table>
      </div>:""
    }
    {userData.rol=='LIDER' ?

    <div>
    <div className='flex flex-row-reverse mx-10'>
        <Link to="/proyectos/RegistroProyectos" className="btn-general mt-20  text-2xl">
          Registrar Proyecto
        </Link>
    </div>
  
    <div className='flex flex-col justify-center items-center'>
      <div className='table-container'>
        <table id='table-list'>
        <thead>
          <tr>
          
            <th className="text-center">Nombre</th>
            <th className="text-center">Presupuesto</th>
            <th className="text-center">Fecha Inicio</th>
            <th className="text-center">Estado </th>
            <th className="text-center">Fase </th>
            <th className="text-center">Objetivos</th>
            <th className="text-center">avances</th>
          </tr>
        </thead>
        <tbody>
          {dataLideres &&
            dataLideres.ProyectosLiderados.map((u) => {
              
              return (
                
                <tr key={u._id}>
                  <td className="text-center">{u.nombre}</td>
                  <td className="text-center">{u.presupuesto}</td>
                  <td className="text-center">{u.fechaInicio}</td>
                  <td className="text-center">{u.estado}</td>
                  <td className="text-center">{u.fase}</td>
              
                  <td key={u._id}><ModalObj id={`exampleModelObjetivos-${u._id}`} objetivos={u.
                    objetivos}></ModalObj>

                  </td>

                  <td key={u._id}><ModalAvan id={`exampleModalAvances-${u._id}`} avances={u.avances}></ModalAvan>
                    
                  </td>
                </tr>
                
              );
              
            })
          }
          </tbody>
        </table>
        </div>
        </div> 
      </div>: ""
    }  
  </div>  
     
  )
};


export default IndexProyectos;


