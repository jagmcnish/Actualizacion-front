import React from 'react';
import { Enum_EstadoInscripcion } from 'utils/enums';

const ModalInscrip = ({id, titulo, avances}) => {
    return (
        <div>
        
        <div className="modal fade" id={id} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">{titulo}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                {avances && avances.map((u)=>{
                    return(
                        <div className='flex flex-col justify-evenly mb-2'>
                            <div>{Enum_EstadoInscripcion[u.inscripcion]}</div>
                        </div>
                    )
                })}
            </div>
            </div>
        </div>
        </div>
            
        </div>
    )
}

export default ModalInscrip
