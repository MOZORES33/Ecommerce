import React from 'react'
import './Alerta.css'

// Este componente es una ventana modal de alerta
export const Alerta = (setActiveModal, textModal1, textModal2, quantityOfButtons, textButtonOne, functionButtonOne, textButtonTwo, functionButtonTwo ) => {
    // Desactivamos el scroll de toda la pagina
    document.body.classList.add('no-scroll');
    
    return (
        <div className={`containerClearCart`}>
            <div className={`ClearCart`}>
                {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                <svg xmlns="http://www.w3.org/2000/svg"
                	fill="none"
                	viewBox="0 0 24 24"
                	strokeWidth="1.5"
                	stroke="currentColor"
                	className="Hicon-close"
                    onClick={function(){document.body.classList.remove('no-scroll'); setActiveModal(0);}}>
                	<path
                		strokeLinecap="round"
                		strokeLinejoin="round"
                		d="M6 18L18 6M6 6l12 12"
                	/>
                </svg>
                <h6>{textModal1}</h6>
                {textModal2? <h6>{textModal2}</h6>: ""}
                <div className="HButtonsClearCart">
                    {quantityOfButtons === 1?
                        functionButtonOne?
                        <button className='button_sky_blue' onClick={() => {functionButtonOne(); document.body.classList.remove('no-scroll'); setActiveModal(0);}}>{textButtonOne}</button>
                        :
                        <button className='button_sky_blue' onClick={() => {document.body.classList.remove('no-scroll'); setActiveModal(0);}}>{textButtonOne}</button>
                    :
                        functionButtonOne?
                        <>                        
                            <button onClick={() => {functionButtonOne(); document.body.classList.remove('no-scroll'); setActiveModal(0);}}>{textButtonOne}</button>
                            <button className='button_sky_blue' onClick={() => {functionButtonTwo(); document.body.classList.remove('no-scroll'); setActiveModal(false);}}>{textButtonTwo}</button>
                        </>
                        :
                        <>                        
                            <button onClick={() => {document.body.classList.remove('no-scroll'); setActiveModal(0);}}>{textButtonOne}</button>
                            <button className='button_sky_blue' onClick={() => {functionButtonTwo(); document.body.classList.remove('no-scroll'); setActiveModal(false);}}>{textButtonTwo}</button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};