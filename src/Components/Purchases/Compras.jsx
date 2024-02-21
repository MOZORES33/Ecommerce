import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Compras.css'
import { Alerta } from '../../utils/Alerta/Alerta.jsx';
import { useNavigate } from 'react-router-dom';
const moment = require('moment');

// Este componente es una sección para ver el historial de compras del usuario y los detalles de cada compra
const Compras = () => {
    const [alertaModal, setAlertaModal] = useState(0);
    const [shopping, setShopping] = useState({});
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [shoppingModal, setShoppingModal] = useState({});
    const [detailsModal, setDetailsModal] = useState({});

    const seeDetails = async (buys) => {
        let id_venta = buys.id
        const body = {id_venta}
        await axios.post('http://localhost:3977/get_purchasing_details', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(({data}) => {
            if(data.toString() === 'error'){
                setAlertaModal(1);
                return
            }
            else if(data.toString() === 'inexistente'){
                setAlertaModal(2);
                return
            }
            setShoppingModal(buys)
            setDetailsModal(data[0])
            setModal(true)
        })
        .catch(() => {
            setAlertaModal(1);
        })
    };

    function navigateLogin(){
        navigate("/login")
    };

    
    useEffect(() => {
        const purchasingData = async () => {
            // En caso de necesitar que funcione en el celular cambiar localhost por la ip de la Pc en todos los componentes como en el siguiente ejemplo:
            // let dataResponse = await axios.get('http://193.158.3.10:5000/productos')
            await axios.get('http://localhost:3977/get_purchases', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(({data}) => {
                if(data.toString() === 'error'){
                    setAlertaModal(1);
                    return
                }
                else if(data.toString() === 'inexistente'){
                    setAlertaModal(2);
                    return
                }
                setShopping(data[0])
            })
            .catch(() => {
                setAlertaModal(1)
            })
        };
        purchasingData();
    }, []);

    return (
        <div className='compras'>
            {alertaModal === 1 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}
            {alertaModal === 2 && Alerta(setAlertaModal, 'Su sesión expiró.', 'Debe inicar sesión nuevamente para continuar.', 1, 'Aceptar', navigateLogin)}
            <h1>Mis Compras</h1>
            <hr />
            <div className="record_compras">
                {shopping.length ? shopping.map(buys => (
                    // Creamos un div y le añadimos la clase card y el id del buyso con buys.id
                    <div className="container_compra" key={buys.id}>
                        <div className="date_compra">
                            <p>{moment(buys.fecha).format('DD-MM-YYYY HH:mm:ss')}</p>
                        </div>
                        <div className="info_compra">
                            <p>Nº Compra: {buys.id}</p>
                            <p>Total: ${buys.total}</p>
                            <button onClick={() => seeDetails(buys)}>Ver compra</button>
                        </div>
                    </div>
                )): (
                    <div className="productNotFound product_not_found_compras">
                        <h1>Cuando realices una compra aparecerá aquí.</h1>
                    </div>
                )}
            </div>



            {/* Formulario de contacto */}
            {/* Se comprueba si contacto es true. En caso de cumplirse la condicion se asigna la clase para mostrar el formulario de contacto. */}
            <div className={`container_modal_details ${modal? 'activecontainerModal' : ''}`}>
                <div className="container_details">
                    <div className={`modal_details ${modal? 'activeModal' : ''}`}>
                        {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                        <svg xmlns="http://www.w3.org/2000/svg"
		                	fill="none"
		                	viewBox="0 0 24 24"
		                	strokeWidth="1.5"
		                	stroke="currentColor"
		                	className="Hicon_close_details"
                            onClick={() => {setModal(false); setShoppingModal({}); setDetailsModal({});}}>
		                	<path
		                		strokeLinecap="round"
		                		strokeLinejoin="round"
		                		d="M6 18L18 6M6 6l12 12"
		                	/>
		                </svg>

                        {shoppingModal ? (
                            <div className="modal_container_compra">
                                <div className="modal_info_compra">
                                    <p>Fecha: {shoppingModal.fecha ? moment(shoppingModal.fecha).format('DD-MM-YYYY HH:mm:ss'): ""}</p>
                                    <p>Nº Compra: {shoppingModal.id}</p>
                                    <p>Total: ${shoppingModal.total}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="productNotFound">
                                <h1>Aún no realizaste compras.</h1>
                            </div>
                        )}

                        <div className="purchase_details_container">
                            {detailsModal.length ? detailsModal.map(details => (
                            // Creamos un div y le añadimos la clase card y el id del buyso con buys.id
                            <div className="container_detail" key={details.id}>
                                <div className="info_detail">
                                    <p>{details.nombre}</p>
                                    <p>Precio: ${details.precio}</p>
                                    <p>Cantidad: {details.cantidad}</p>
                                </div>
                            </div>
                            )): (
                                <div className="not_found_details">
                                    <h1>Aún no realizaste compras.</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compras