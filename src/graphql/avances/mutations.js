import { gql } from '@apollo/client';

const CREAR_AVANCE = gql`
mutation Mutation($fecha: Date!, $descripcion: String!, $proyecto: String!, $creadoPor: String!) {
  crearAvance(fecha: $fecha,
     descripcion: $descripcion,
      proyecto: $proyecto, 
      creadoPor: $creadoPor) {
    fecha
    descripcion
  }
}
`;

export { CREAR_AVANCE };
