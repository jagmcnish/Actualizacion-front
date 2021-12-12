import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROYECTOS } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import { Enum_EstadoProyecto } from 'utils/enums';
import { Enum_FaseProyecto } from 'utils/enums';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO } from 'graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREAR_INSCRIPCION } from 'graphql/inscripciones/mutations';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexProyectos = () => {
  const { data: queryData, loading, error } = useQuery(GET_PROYECTOS);

  useEffect(() => {
    console.log('datos proyecto', queryData);
  }, [queryData]);

  if (loading) return <div className='text-2xl font-bold text-gray-900'>Cargando...</div>;

  if (queryData.Proyectos) {
    return (
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Lista de Proyectos</h1>
        </div>
        <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
          <div className='my-2 self-end'>
            <button className='bg-green-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-green-400'>
              <Link to='/proyectos/nuevo'>Crear proyecto</Link>
            </button>

            <button className='bg-green-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-green-400'>
              <Link to='/proyectos/resumen'> Resumen proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Proyectos.map((proyecto) => {
          return <AccordionProyecto proyecto={proyecto} />;
        })}
      </div>
    );
  }

  return <></>;
};

const AccordionProyecto = ({ proyecto }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled expandIcon={<i className='fas fa-chevron-down' />}>
          <div className='flex w-full justify-between'>
            <div className='uppercase font-bold text-gray-50 '>
              {proyecto.nombre} - {proyecto.estado} - {proyecto.fase} 
            </div>
          </div>
        </AccordionSummaryStyled>

        <AccordionDetailsStyled>
          <PrivateComponent roleList={['ADMINISTRADOR']}>

            <i
              className='mx-4 fas fa-pen text-blue-600 hover:text-yellow-400'
              onClick={() => {
                setShowDialog(true);
              }}
            /> 
            <span>Actualizar Estado</span>
            
             <i
              className='mx-4 fas fa-pen text-blue-600 hover:text-red-400'
              onClick={() => {
                setShowDialog(true);
              }}
            />
            <span>Actualizar Fase</span>
         
          </PrivateComponent>

          <PrivateComponent roleList={['ESTUDIANTE']}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div>Liderado por: {proyecto.lider.correo}</div>
          <div className='flex'>
            {proyecto.objetivos.map((objetivo) => {
              return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
            })}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto _id={proyecto._id} />
      </Dialog>

      {/* <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
              }}
      >
        <FormEditFaseProyecto _id={proyecto._id} />
      </Dialog> */}

    </>
  );
};

const FormEditProyecto = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarProyecto, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
    editarProyecto({
      variables: {
        _id,
        campos: formData,
      },
    });
  };

  useEffect(() => {
    console.log('data mutation', dataMutation);
  }, [dataMutation]);

  return (
    <div className='p-4'>
      <h1 className='font-bold'>Estado proyecto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center '
      >
        <DropDown label=' Proyecto' name='estado' className= 'border border-gray-700' options={Enum_EstadoProyecto} />
        <ButtonLoading disabled={false} loading={loading} text='Confirmar' />
      </form>
    </div>
  );
};

const FormEditFaseProyecto = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarProyect, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
    editarProyect({
      variables: {
        _id,
        campos: formData,
      },
    });
  };

  useEffect(() => {
    console.log('data mutation', dataMutation);
  }, [dataMutation]);

  return (
    <div className='p-4'>
      <h1 className='font-bold'>Fase Proyecto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center '
      >
        <DropDown label='Fase del Proyecto' name='Fase' className= 'border border-gray-700' options={Enum_FaseProyecto} />
        <ButtonLoading disabled={false} loading={loading} text='Confirmar' />
      </form>
    </div>
  );
};


const Objetivo = ({ tipo, descripcion }) => {
  return (
    <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
      <div className='text-lg font-bold'>{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={['ADMINISTRADOR']}>
        <div>Editar</div>
      </PrivateComponent>
    </div>
  );
};

const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
  const [estadoInscripcion, setEstadoInscripcion] = useState('');
  const [crearInscripcion, { data, loading, error }] = useMutation(CREAR_INSCRIPCION);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && inscripciones) {
      const flt = inscripciones.filter((el) => el.estudiante._id === userData._id);
      if (flt.length > 0) {
        setEstadoInscripcion(flt[0].estado);
      }
    }
  }, [userData, inscripciones]);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success('Inscripcion creada con exito');
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({ variables: { proyecto: idProyecto, estudiante: userData._id } });
  };

  return (
    <>
      {estadoInscripcion !== '' ? (
        <span>Ya estas inscrito en este proyecto y el estado es {estadoInscripcion}</span>
      ) : (
        <ButtonLoading
          onClick={() => confirmarInscripcion()}
          disabled={estado === 'INACTIVO'}
          loading={loading}
          text='Inscribirme en este proyecto'
        />
      )}
    </>
  );
};

export default IndexProyectos;



  
     

