import { React, useState, useEffect } from "react";
import { useUser } from "context/userContext";
import Indicador from "../../components/Indicador";
import { UserContext } from "context/userContext";
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import { GET_USUARIO } from 'graphql/usuarios/queries';
import { useQuery, useMutation } from '@apollo/client';
import useFormData from 'hooks/useFormData';
import { EDITAR_USUARIO, ACTUALIZAR_PASSWORD } from 'graphql/usuarios/mutations';
import { toast } from 'react-toastify';
import { data } from "autoprefixer";
import zxcvbn from 'zxcvbn'

const Perfil = () => {
  const [modalContraseña, setModalContraseña] = useState(false);
  const [modalDatos, setModalDatos] = useState(false);
  const [contraseña, setContraseña] = useState("");
  const [confirmarcontraseña, setConfirmarContraseña] = useState("");
  const { form, formData, updateFormData } = useFormData(null);
  const { form: passwordForm, formData: passwordData, updateFormData: updatePasswordData } = useFormData(null);
  const testResult=zxcvbn(contraseña);
  const { userData } = useUser();  
  const _id = userData._id;
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery(GET_USUARIO, {
    variables: { _id },
  });
  let correo;
  if (queryData) {
    correo = queryData.Usuario.correo;
  } else {
    correo = ""
  }

  const [editarUsuario, { data: mutationData, loading: mutationLoading, error: mutationError }] =
    useMutation(EDITAR_USUARIO);

  const [actualizarPassword, { data: dataPassword, loading: loadingPassword, error: errorPassword }] =
    useMutation(ACTUALIZAR_PASSWORD);

  const submitPassword = (e) => {
    e.preventDefault();
    actualizarPassword({
      variables: { correo, ...passwordData }
    });
  }
  const submitForm = (e) => {
    e.preventDefault();
    delete formData.rol;
    if (formData.identificacion === "") {
      delete formData.identificacion
    }
    if (formData.nombre === "") {
      delete formData.nombre
    }
    if (formData.apellido === "") {
      delete formData.apellido
    }
    if (formData.correo === "") {
      delete formData.correo
    }
    editarUsuario({
      variables: { _id, ...formData },
    });
    setModalDatos(false)
  };
  
  useEffect(() => {
    if (dataPassword) {
      if (dataPassword.actualizarPassword.mensaje === true) {
        toast.success("Contraseña actualizada")
        setModalContraseña(false);
        dataPassword.actualizarPassword.mensaje = false;
      } else {
        toast.error("La contraseña actual no coincide")
      }
    }
  }, [dataPassword]);

  return (
    <>
    <div className='p-5 flex flex-col'>
    <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Perfil Usuario</h1>
        </div>
      </div>
      <div className="relative justify-center py-4  bg-blue-300">
        <div className="container px-4 justify-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="text-center mt-12">
                  <i className="fas fa-address-card fa-5x"></i>
                  <h3 className="text-2xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                    {queryData ? queryData.Usuario.nombre + " " + queryData.Usuario.apellido : ""}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    <i className="fas fa-user mr-2 text-lg text-gray-500"></i>{" "}
                    Rol: {queryData ? Enum_Rol[queryData.Usuario.rol] : ""}
                  </div>
                </div>
              </div>
              <div className="mt-1 py-5 border-t border-gray-700">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <form className="bg-indigo shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto sm:max-w-xl">
                      <div className="m-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="identificacion"
                        >
                          Identificación
                        </label>
                        <input
                          className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                          type="text"
                          id="identificacion"
                          placeholder="Identificación"
                          disabled
                          value={queryData ? queryData.Usuario.identificacion : ""}
                        />
                      </div>
                      <div className="m-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="correo"
                        >
                          Correo
                        </label>
                        <input
                          className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                          type="email"
                          id="correo"
                          placeholder="Correo"
                          disabled
                          value={queryData ? queryData.Usuario.correo : ""}
                        />
                      </div>
                      <div className="m-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"

                        >
                          Estado
                        </label>
                        <input
                          className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                          type="text"
                          id="estado"
                          placeholder="Estado"
                          disabled
                          value={queryData ? Enum_EstadoUsuario[queryData.Usuario.estado] : ""}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          className="bg-green-700 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="button"
                          onClick={() => setModalContraseña(true)}
                        >
                          Cambiar contraseña
                        </button>
                        <button
                          className="bg-green-700 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="button"
                          onClick={() => setModalDatos(true)}
                        >
                          Actualizar datos
                        </button>
                      </div>
                    </form>
                    {/*Modal actualizar contraseña*/}
                    {modalContraseña ? (
                      <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                              {/*header*/}
                              <div className="bg-blue-300 flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-3xl text-white font-semibold">
                                  Cambiar contraseña
                                </h3>
                                <button
                                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                  onClick={() => setModalContraseña(false)}
                                >
                                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                  </span>
                                </button>
                              </div>
                              {/*body*/}

                              <form className="rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto sm:max-w-xl"
                                onSubmit={submitPassword}
                                onChange={updatePasswordData}
                                ref={passwordForm}>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="contraseña"
                                  >
                                    Contraseña actual
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="password"
                                    id="nuevacontraseña"
                                    placeholder="Constraseña"
                                    name="password"
                                  />
                                  {contraseña !== confirmarcontraseña ? <label
                                    className="block text-red-600 text-xs font-bold mb-2 text-center"
                                  >  Las contraseñas no coinciden
                                  </label> : <></>}
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="contraseña"
                                  >
                                    Nueva contraseña
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="password"
                                    id="nuevacontraseña"
                                    placeholder="Constraseña"
                                    name="nuevapassword"
                                    onChange={(e) =>
                                      setContraseña(e.target.value)
                                    }
                                  />
                                  <Indicador password={contraseña} />
                                </div>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="confircontraseña"
                                  >
                                    Confirmar contraseña
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="password"
                                    id="confircontraseña"
                                    placeholder="Confirmar contraseña"
                                    onChange={(e) =>
                                      setConfirmarContraseña(e.target.value)
                                    }
                                  />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                  <button
                                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => setModalContraseña(false)}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    className={((testResult.score<3)||((contraseña !== confirmarcontraseña) || (contraseña === "" && confirmarcontraseña === ""))) ? "bg-gray-700 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline cursor-not-allowed" : "bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"}
                                    type="submit"
                                    disabled={((testResult.score<3)||((contraseña !== confirmarcontraseña) || (contraseña === "" && confirmarcontraseña === ""))) ? true : false}                               
                                  >
                                    Actualizar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                      </>
                    ) : null}
                    {/*Modal actualizar datos*/}
                    {modalDatos ? (
                      <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                              {/*header*/}
                              <div className="bg-blue-300 flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-3xl text-white font-semibold">
                                  Actualizar Datos
                                </h3>
                                <button
                                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                  onClick={() => setModalDatos(false)}
                                >
                                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                  </span>
                                </button>
                              </div>
                              {/*body*/}

                              <form className="rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto sm:max-w-xl"
                                onSubmit={submitForm}
                                onChange={updateFormData}
                                ref={form}>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="identificacion"
                                  >
                                    Identificación
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="text"
                                    id="identificacion"
                                    name="identificacion"
                                    placeholder={queryData ? queryData.Usuario.identificacion : ""}
                                  />
                                </div>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="nombre"
                                  >
                                    Nombre
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder={queryData ? queryData.Usuario.nombre : ""}
                                  />
                                </div>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="apellido"
                                  >
                                    Apellido
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    placeholder={queryData ? queryData.Usuario.apellido : ""}
                                  />
                                </div>
                                <div className="m-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="correo"
                                  >
                                    Correo
                                  </label>
                                  <input
                                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    placeholder={queryData ? queryData.Usuario.correo : ""}
                                  />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                  <button
                                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => setModalDatos(false)}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    className="bg-green-700 hover:bg-green-400 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                  >
                                    Actualizar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
