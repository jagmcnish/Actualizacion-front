import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useUser } from "../../context/userContext";
import useFormData from "hooks/useFormData";
import { useQuery, useMutation } from "@apollo/client";
import { OBTENER_AVANCE } from "graphql/avances/queries";
import { EDITAR_AVANCE } from "graphql/avances/mutations";
import { toast } from "react-toastify";
import PrivateComponent from "components/PrivateComponent";
import ReactLoading from "react-loading";

const ActualizarAvance = () => {
  const { form, formData, updateFormData } = useFormData(null);
  const { userData } = useUser();
  const { _id } = useParams();
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery(OBTENER_AVANCE, {
    variables: {
      _id,
    },
  });
  const [aviso, setAviso] = useState(true);
  const [cambios, setCambios] = useState(false);

  useEffect(() => {
    if (queryError) {
      toast.error("Error obteniendo el avance");
    }
  }, [queryError]);

  const [
    editarAvance,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(EDITAR_AVANCE);

  const submitForm = (e) => {
    e.preventDefault();
    delete formData.fechaAvance;
    delete formData.creadoPor;
    console.log("fd", formData);
    editarAvance({
      variables: {
        _id,
        ...formData,
      },
    });
  };

  useEffect(() => {
    if (mutationData && mutationData.editarAvance === null) {
      // console.log("md terminado", mutationData.editarAvance);
      toast.warning("No se pudo editar el avance");
    } else if (mutationData && mutationData.editarAvance !== null) {
      // console.log("md desarrollo", mutationData.editarAvance);
      toast.success(" Avance Actualizado correctamente");
    }
    if (mutationError) {
      toast.error("Error actualizando el avance");
    }
  }, [mutationData, mutationError]);

  if (queryLoading || mutationLoading) {
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

  if (!queryLoading) {
    return (
      <div>
        <div className="text-center">
          <div className="navbar p-12">
            <span>Actualización de Avances</span>
          </div>
          <div className="flex justify-start items-center ml-10 mt-10">
            <Link to="/avances" className="btn-general">
              <i className="fas fa-arrow-left"></i>
            </Link>
            {aviso === true && (
              <span className="ml-8 bg-green-300 bg-opacity-60 p-2 rounded-md text-green-700 animate-bounce">
                Si no actualizaste algo, haz clic en el botón atrás o de
                cancelar
              </span>
            )}
          </div>
        </div>
        <form
          onSubmit={submitForm}
          onChange={updateFormData}
          ref={form}
          className="flex flex-col items-center mt-12 w-auto"
        >
          {userData.rol === "ESTUDIANTE" && (
            <>
              <div className="grid grid-cols-3 gap-1 w-auto">
                <div className="form-general">
                  <span className="pr-2 text-lg">Proyecto</span>
                  <input
                    type="text"
                    name="proyecto"
                    className="input-general "
                    defaultValue={queryData.Avance.proyecto.nombre}
                    readOnly
                    required
                  />
                </div>
                <div className="form-general">
                  <span className="pr-2 text-lg">Fecha</span>
                  <input
                    type="text"
                    name="fechaAvance"
                    className="input-general"
                    defaultValue={queryData.Avance.fechaAvance.slice(0, 10)}
                    readOnly
                    required
                  />
                </div>
                <div className="form-general">
                  <span className="pr-2 text-lg">Creado por</span>
                  <input
                    type="text"
                    name="creadoPor"
                    className="input-general"
                    defaultValue={
                      queryData.Avance.creadoPor.nombre +
                      " " +
                      queryData.Avance.creadoPor.apellido
                    }
                    readOnly
                    required
                  />
                </div>
              </div>
              <div className="mt-10 flex flex-col items-center">
                <h2 className='text-2xl font-bold text-gray-900'>Descripción</h2>
                <textarea
                  name="descripcion"
                  cols="40"
                  rows="5"
                  placeholder="Ingrese aquí su descripción"
                  className="input-general text-lg"
                  defaultValue={queryData.Avance.descripcion}
                  onClick={() => setAviso(false)}
                  onChange={() => setCambios(true)}
                  required
                ></textarea>
              </div>
              <PrivateComponent roleList={["LIDER", "ADMINISTRADOR"]}>
                <div className="mt-7 flex flex-col items-center">
                  <span className="pb-2 text-lg">Observaciones</span>
                  <textarea
                    name="observaciones"
                    cols="40"
                    rows="5"
                    placeholder="Escribe aquí tus observaciones"
                    className="input-general text-lg"
                    defaultValue={queryData.Avance.observaciones}
                    onChange={() => setCambios(true)}
                    required
                  ></textarea>
                </div>
              </PrivateComponent>
            </>
          )}
          {userData.rol === "LIDER" && (
            <>
              <div className="grid grid-cols-3 gap-6 w-auto">
                <div className="flex flex-col justify-center items-center">
                  <span className="pr-2 text-lg">Proyecto</span>
                  <div className="form-general">
                    <input
                      type="text"
                      name="proyecto"
                      className="input-general"
                      defaultValue={queryData.Avance.proyecto.nombre}
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="pr-2 text-lg">Fecha</span>
                  <div className="form-general">
                    <input
                      type="text"
                      name="fechaAvance"
                      className="input-general"
                      defaultValue={queryData.Avance.fechaAvance.slice(0, 10)}
                      disabled
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="pr-2 text-lg">Creado por</span>
                  <div className="form-general">
                    <input
                      type="text"
                      name="creadoPor"
                      className="input-general"
                      defaultValue={
                        queryData.Avance.creadoPor.nombre +
                        " " +
                        queryData.Avance.creadoPor.apellido
                      }
                      disabled
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-auto">
                <div className="mt-10 flex flex-col items-center">
                  <span className="pb-2 text-lg">Descripción</span>
                  <textarea
                    name="descripcion"
                    cols="40"
                    rows="5"
                    placeholder="Escribe aquí tu descripción"
                    className="input-general text-lg"
                    defaultValue={queryData.Avance.descripcion}
                    onChange={() => setCambios(true)}
                    readOnly
                  ></textarea>
                </div>
                <PrivateComponent roleList={["LIDER", "ADMINISTRADOR"]}>
                  <div className="mt-10 flex flex-col items-center">
                    <span className="pb-2 text-lg">Observaciones</span>
                    <textarea
                      name="observaciones"
                      cols="40"
                      rows="5"
                      placeholder="Escribe aquí tus observaciones"
                      className="input-general text-lg"
                      defaultValue={queryData.Avance.observaciones}
                      onClick={() => setAviso(false)}
                      onChange={() => setCambios(true)}
                      required
                    ></textarea>
                  </div>
                </PrivateComponent>
              </div>
            </>
          )}
          {userData.rol === "ADMINISTRADOR" && (
            <>
              <div className="grid grid-cols-3 gap-1 w-auto">
                <div className="form-general">
                  <span className="pr-2 text-lg">Proyecto</span>
                  <input
                    type="text"
                    name="proyecto"
                    className="input-general"
                    defaultValue={queryData.Avance.proyecto.nombre}
                    required
                  />
                </div>
                <div className="form-general">
                  <span className="pr-2 text-lg">Fecha</span>
                  <input
                    type="text"
                    name="fechaAvance"
                    className="input-general"
                    defaultValue={queryData.Avance.fechaAvance.slice(0, 10)}
                    required
                  />
                </div>
                <div className="form-general">
                  <span className="pr-2 text-lg">Creado por</span>
                  <input
                    type="text"
                    name="creadoPor"
                    className="input-general"
                    defaultValue={
                      queryData.Avance.creadoPor.nombre +
                      " " +
                      queryData.Avance.creadoPor.apellido
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-auto">
                <div className="mt-10 flex flex-col items-center">
                  <span className="pb-2 text-lg">Descripción</span>
                  <textarea
                    name="descripcion"
                    cols="40"
                    rows="5"
                    placeholder="Escribe aquí tu descripción"
                    className="input-general text-lg"
                    defaultValue={queryData.Avance.descripcion}
                    onClick={() => setAviso(false)}
                    onChange={() => setCambios(true)}
                    required
                  ></textarea>
                </div>
                <PrivateComponent roleList={["LIDER", "ADMINISTRADOR"]}>
                  <div className="mt-10 flex flex-col items-center">
                    <span className="pb-2 text-lg">Observaciones</span>
                    <textarea
                      name="observaciones"
                      cols="40"
                      rows="5"
                      placeholder="Escriba aquí sus observaciones"
                      className="input-general text-lg"
                      defaultValue={queryData.Avance.observaciones}
                      onClick={() => setAviso(false)}
                      onChange={() => setCambios(true)}
                      required
                    ></textarea>
                  </div>
                </PrivateComponent>
              </div>
            </>
          )}

          <div className="form-general">
            <div className="grid grid-cols-2 gap-6 mt-5 text-center">
              <Link
                to="/avances"
                className="btn-general-cancelar mt-6 text-2xl"
              >
                Cancelar
              </Link>
              {cambios ? (
                <button
                  className="btn-general-submit mt-6 text-2xl"
                  type="submit"
                >
                  Actualizar
                </button>
              ) : (
                <button
                  className="btn-general-submit mt-6 text-2xl"
                  type="submit"
                  disabled
                >
                  Actualizar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default ActualizarAvance;
