
import {gql} from '@apollo/client';

const EDITAR_PROYECTO = gql`
   mutation Mutation($_id: String!, $campos: camposProyecto!) {
     editarProyecto(_id: $_id, campos: $campos) {
       _id
       estado
       fase
     }
   }
 `;

const CREAR_PROYECTO=gql`
    mutation crearProyecto(
        $nombre: String!
        $presupuesto: Float!
        $fechaInicio: Date!
        $fechaFin: Date!
        $lider: String!
        $objetivos:[crearObjetivo]
    ) {
        crearProyecto(
            nombre: $nombre
            presupuesto: $presupuesto
            fechaInicio: $fechaInicio
            fechaFin: $fechaFin
            lider: $lider
            objetivos: $objetivos
        ) {
          _id  
          nombre    
    }
  }
`

export {EDITAR_PROYECTO, CREAR_PROYECTO}
