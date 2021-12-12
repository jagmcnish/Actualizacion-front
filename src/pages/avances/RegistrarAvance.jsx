import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import useFormData from "hooks/useFormData";
import PrivateComponent from "components/PrivateComponent";
import { CREAR_AVANCE } from "graphql/avances/mutations";
import { OBTENER_PROYECTOS_LITE } from "graphql/avances/queries";

const RegistrarAvance = () => {
  const { form, formData, updateFormData } = useFormData(null);

  const {
    data: queryProyectosData,
    error: queryProyectosError,
    loading: queryProyectosLoading,
    refetch,
  } = useQuery(OBTENER_PROYECTOS_LITE);
  const [aviso, setAviso] = useState(true);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    console.log("queryProyectosData", queryProyectosData);
  }, [queryProyectosData]);

  useEffect(() => {
    if (queryProyectosError) {
      toast.error("Error consultando los proyectos");
    }
  }, [queryProyectosError]);

  const [
    crearAvance,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREAR_AVANCE);

  const submitForm = (e) => {
    e.preventDefault();
    crearAvance({
      variables: {
        ...formData,
      },
    });
  };

  useEffect(() => {
    if (mutationData && mutationData.crearAvance === null) {
      // console.log("md terminado", mutationData.crearAvance);
      toast.warning("No se pudo crear el avance");
    } else if (mutationData && mutationData.crearAvance !== null) {
      // console.log("md desarrollo", mutationData.crearAvance);
      toast.success("Avance creado correctamente");
    }
    if (mutationError) {
      toast.error("Error creando el avance");
    }
  }, [mutationData, mutationError]);

  if (queryProyectosLoading || mutationLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ReactLoading
          type="spinningBubbles"
          color="#7fffd4"
          height={150}
          width={150}
        />
      </div>
    );
  }

  if (!queryProyectosLoading) {
    return (
      <div>
        <div className='p-7 flex flex-col'>
          <div className='flex w-full items-center justify-center'>
            <span className='text-2xl font-bold text-gray-900'>Registro de Avances</span>
          </div>
          <div className="flex justify-start ml-10 mt-10">
            <Link to="/avances" className="btn-general">
              <i className="fas fa-arrow-left"></i>
            </Link>
            {aviso === true && (
              <span className="ml-8 bg-blue-300 bg-opacity-60 p-2 rounded-md text-black animate-bounce">
                ¡En esta sección solo se pueden ingresar avances en los proyectos que
                esté inscrito!
              </span>
            )}
          </div>
        </div>
        <form
          onSubmit={submitForm}
          onChange={updateFormData}
          ref={form}
          className="flex flex-col items-center mt-14"
        >
          <div className="grid grid-cols-1 w-auto">
            <div className="form-general">
              <span className='text-2xl  text-gray-900'>Proyectos: </span>
              <select
                name="proyecto"
                type="text"
                defaultValue=""
                className="input-general text-lg"
                required
              >
                <option value="" disabled>
                  Seleccione una opción...
                </option>
                {queryProyectosData &&
                  queryProyectosData.ProyectosRegistrar.map((el) => {
                    return (
                      <option key={el._id} value={el._id}>
                        {el.nombre}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="grid grid-cols-1 w-auto mt-4">
              <div className="mt-9 flex flex-col items-center">
                <span className='text-2xl font-bold text-gray-900'>Descripción</span>
                <textarea
                  name="descripcion"
                  cols="40"
                  rows="5"
                  placeholder="Descripcion del proyecto"
                  className="p-3 input-general text-lg"
                  onClick={() => setAviso(false)}
                  required
                ></textarea>
              </div>
              <PrivateComponent roleList={["LIDER"]}>
                <div className="mt-9 flex flex-col items-center">
                  <span className="pb-2">Observaciones</span>
                  <textarea
                    name="observaciones"
                    cols="40"
                    rows="5"
                    placeholder="Escriba aquí sus observaciones"
                    className="input-general"
                    onClick={() => setAviso(false)}
                  ></textarea>
                </div>
              </PrivateComponent>
            </div>
          </div>
          <div className="form-general">
            <div className="grid grid-cols-2 gap-6 mt-5 text-center">
              <Link
                to="/avances"
                className='bg-green-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-green-400'
              >
                Cancelar
              </Link>
              <button
                className='bg-green-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-green-400'
                type="submit"
              >
                Registrar
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default RegistrarAvance;