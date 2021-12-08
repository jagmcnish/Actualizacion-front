import { gql } from '@apollo/client';

const GET_AVANCES = gql`
query Query {
  Avances {
    _id
    fecha
    descripcion
    observaciones
  }
}
`;

export { GET_AVANCES };
