import { gql } from '@apollo/client';

const GET_PROYECTOS = gql`
  query Proyectos {
    Proyectos {
      _id
      nombre
      estado
      objetivos {
        descripcion
        tipo
      }
      lider {
        _id
        correo
      }
      inscripciones {
        estado
        estudiante {
          _id
        }
      }
    }
  }
`;

const GET_PROYECTOS_LIDERADOS = gql`
  query ProyectosLiderados($idLider: String!) {
    ProyectosLiderados(idLider: $idLider) {
      _id
      nombre
      presupuesto
      fechaInicio
      fechaFin
      estado
      fase
      lider {
        nombre
      }
      objetivos {
        descripcion
        tipo
      }
      avances {
        _id
        descripcion
      }
    }
  }
`;

export { GET_PROYECTOS, GET_PROYECTOS_LIDERADOS };

