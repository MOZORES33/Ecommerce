import React, { useState } from 'react'
import './Eliminar_producto.css'
import axios from 'axios'
import { Alerta } from '../../utils/Alerta/Alerta.jsx';
import { useNavigate } from 'react-router-dom';

const Eliminar_producto = ({ response, setResponse }) => {

    const [alertaModal, setAlertaModal] = useState(0);

    const navigate = useNavigate();

    function navigateLogin(){
        navigate("/login")
    };

    const deleteProduct = async (id, urlImage) => {
        let body = { id, urlImage }
        await axios.post('http://localhost:3977/delete_product', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(({data}) => {
            console.log(data)
            if(data.toString() === 'error1'){
                setAlertaModal(2);
                return
            }
            else if(data.toString() === 'error2'){
                setAlertaModal(1);
                return
            }
            else if(data.toString() === 'error3'){
                setResponse(response.filter(item => item.id !== id));
                setAlertaModal(4);
                return
            }
            else if(data.toString() === 'correcto'){
                setResponse(response.filter(item => item.id !== id));
                setAlertaModal(3);
                return
            }
            
        })
        .catch(() => {
            setAlertaModal(1);
        })
    }

    return (
        <div className="container_delete_product" >
            {alertaModal === 1 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}
            {alertaModal === 2 && Alerta(setAlertaModal, 'Su sesión expiró.', 'Debe inicar sesión nuevamente para continuar.', 1, 'Aceptar', navigateLogin)}
            {alertaModal === 3 && Alerta(setAlertaModal, 'El producto fue eliminado correctamente.', '', 1, 'Aceptar')}
            {alertaModal === 4 && Alerta(setAlertaModal, 'El producto fue eliminado correctamente.', 'Pero la imagen del producto no pudo ser eliminada del servidor', 1, 'Aceptar')}

            <div className="container_card_delete_product">
                {/* Comprobamos si products es distinto de nulo. En caso de cumplirse la condicion se muestran los productos. En caso contrario se muestra un mensaje indicando que no se encontraron productos */}
                {/* Aquí ejecutamos un map para mostrar todos los productos que se encuentran cargados en el archivo data.js */}
                {/* Con la constante product vamos añadiendo todos los productos que se encuentran en data.js */}
                {response.length ? response.map(product => (
                    // Creamos un div y le añadimos la clase card y el id del producto con product.id
                    <div className="card_delete_product" key={product.id}>
                        {/* Cargamos la imagen con product.urlImage y el nombre del producto en alt con product.nombre */}
                        <center>   <img src={`http://localhost:3977/imagenes/${product.urlImage}`} alt={product.urlImage} /> </center>
                        {/* Mostramos el nombre del producto con product.nombre */}
                        <h6>{product.nombre}</h6>
                        {/* Mostramos el precio del producto con product.precio */}
                        <p>${product.precio}</p>
                        {/* Creamos un boton y le añadimos el evento onClick para que cuando se precione ejecute el metodo onAddProduct que añade el producto al carrito*/}
                        <button onClick={() => deleteProduct(product.id, product.urlImage)}>Eliminar producto</button>
                    </div>
                )): (
                    <div className="productNotFound">
                        <h1>No se encontraron productos para mostrar</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Eliminar_producto