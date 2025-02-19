import React from "react";
import "./cancelStep.css";


function CancelStep (solicitud){
    
    return(
        <div>
            <div className="cancelStep">
                <h1 className="cancelStep__title">Solicitud Cancelada</h1>
                <p className="cancelStep__text">La solicitud ha sido cancelada.</p>
            </div>
        </div>

    )
}

export default CancelStep;
