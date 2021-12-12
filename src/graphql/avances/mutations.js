import { gql } from "@apollo/client";

const EDITAR_AVANCE = gql`
  mutation editarAvance(
    $_id: String!
    $proyecto: String
    $descripcion: String!
    $observaciones: String
  ) {
    editarAvance(
      _id: $_id
      proyecto: $proyecto
      descripcion: $descripcion
      observaciones: $observaciones
    ) {
      _id
      descripcion
      observaciones
      fechaAvance
      proyecto {
        _id
      }
      creadoPor {
        _id
      }
    }
  }
`;

const CREAR_AVANCE = gql`
  mutation crearAvance(
    $descripcion: String!
    $proyecto: String!
    $creadoPor: String
    $observaciones: String
  ) {
    crearAvance(
      descripcion: $descripcion
      proyecto: $proyecto
      creadoPor: $creadoPor
      observaciones: $observaciones
    ) {
      _id
    }
  }
`;

export { EDITAR_AVANCE, CREAR_AVANCE };
