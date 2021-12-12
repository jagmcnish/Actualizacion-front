import { gql } from '@apollo/client';

const CREAR_USUARIO = gql`
  mutation CrearUsuario(
    $nombre: String!
    $apellido: String!
    $identificacion: String! 
    $rol: Enum_Rol!
    $correo: String!
    $password: String!
    
  ){
    crearUsuario(
      nombre: $nombre
      apellido: $apellido
      identificacion: $identificacion
      rol: $rol
      correo: $correo      
      password: $password
    ){
      _id
    }
  }
`;

const EDITAR_USUARIO = gql`
  mutation EditarUsuario(
    $_id: String!
    $nombre: String!
    $apellido: String!
    $identificacion: String!
    $correo: String!
    $estado: Enum_EstadoUsuario!
  ) {
    editarUsuario(
      _id: $_id
      nombre: $nombre
      apellido: $apellido
      identificacion: $identificacion
      correo: $correo
      estado: $estado
    ) {
      _id
      nombre
      apellido
      correo
      estado
      identificacion
      rol
    }
  }
`;

const ACTUALIZAR_PASSWORD = gql`
mutation ActualizarPassword(
  $correo: String!, 
  $password: String!, 
  $nuevapassword: String!) {
  actualizarPassword(
    correo: $correo, 
    password: $password, 
    nuevapassword: $nuevapassword) {

    mensaje
    
  }
}
`;
export { CREAR_USUARIO, EDITAR_USUARIO, ACTUALIZAR_PASSWORD };
