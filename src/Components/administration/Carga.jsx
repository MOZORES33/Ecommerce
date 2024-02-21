import React, { useState, useEffect } from 'react'
import './Carga.css'
import axios from 'axios';
import { RiImageAddFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { Alerta } from '../../utils/Alerta/Alerta.jsx';
import { useNavigate } from 'react-router-dom';

const Carga = ({ allCategories, setAllCategories }) => {
    const [alertaModal, setAlertaModal] = useState(0);
    const [addCategory, setAddCategory] = useState(false);
    const navigate = useNavigate();

    function navigateLogin(){
        navigate("/login")
    };

    function mostrarImagen() {
        let file = document.getElementById('inputFile').files[0];
    
        if (file) {
            let reader = new FileReader();
    
            reader.onload = function (e) {
                document.getElementById('imagenMostrada').src = e.target.result;
                document.getElementById('containerImagenMostrada').style.backgroundColor = '#fff'
            };
    
            reader.readAsDataURL(file);
        }
    }

    const cargarProducto = async () => {
        if(document.getElementById('nombre').value === "")
            return setAlertaModal(1);
        else if(document.getElementById('precio').value === "")
            return setAlertaModal(2);
        else if(!document.getElementById('inputFile').files[0])
            return setAlertaModal(3);


        let form = document.getElementById('form_carga');
        let formData = new FormData(form);

        let categoria = document.getElementById('selectCategory').value;
        formData.append('categoria', categoria);

        if (!formData)
            return

        let body = formData

        await axios.post('http://localhost:3977/upload_product', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(({data}) => {
            if(data.toString() === 'correcto'){
                document.getElementById('inputFile').value = null;
                document.getElementById('imagenMostrada').src = "";
                document.getElementById('containerImagenMostrada').style.backgroundColor = 'transparent';
                document.getElementById("nombre").value = "";
                document.getElementById("descripcion").value = "";
                document.getElementById("selectCategory").selectedIndex = 0;
                document.getElementById("precio").value = "";
                setAlertaModal(4);
            }
            else if (data.toString() === 'error1'){
                setAlertaModal(7);
            }
            else if (data.toString() === 'error'){
                setAlertaModal(5);
            }
        })
        .catch(() => {
            setAlertaModal(5);
        })
    }

    const addNewCategory = async () => {
        let valor = document.getElementById('nuevaCategoria').value;
        let body = { valor }
        await axios.post('http://localhost:3977/new_category', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(({data}) => {
            if(data.toString() === 'error1'){
                setAlertaModal(7);
                return
            }
            else if(data.toString() === 'error2'){
                setAlertaModal(5);
                return
            }
            else if(data.toString() === 'error3'){
                setAlertaModal(6);
                return
            }
            else if(data.toString() === 'correcto'){
                setAddCategory(false);
                let newCategory = {id: allCategories.length + 1, categoria: valor}
                setAllCategories([...allCategories, newCategory])
                
                document.getElementById("nuevaCategoria").value = "";
                let selectCategory = document.getElementById("selectCategory");
                setTimeout(function(){selectCategory.selectedIndex = selectCategory.options.length - 1}, 300)
                return
            }
            
        })
        .catch(() => {
            setAlertaModal(5);
        })
    }
    
    return (
        <div className='container_carga'>
            {alertaModal === 1 && Alerta(setAlertaModal, 'Debe ingresar el nombre del producto.', '', 1, 'Aceptar')}
            {alertaModal === 2 && Alerta(setAlertaModal, 'Debe ingresar el precio del producto.', '', 1, 'Aceptar')}
            {alertaModal === 3 && Alerta(setAlertaModal, 'Debe cargar la imagen del producto.', '', 1, 'Aceptar')}
            {alertaModal === 4 && Alerta(setAlertaModal, 'El producto fue añadido correctamente.', '', 1, 'Aceptar')}
            {alertaModal === 5 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}
            {alertaModal === 6 && Alerta(setAlertaModal, 'La categoria que intenta añadir ya existe.', '', 1, 'Aceptar')}
            {alertaModal === 7 && Alerta(setAlertaModal, 'Su sesión expiró.', 'Debe inicar sesión nuevamente para continuar.', 1, 'Aceptar', navigateLogin)}

            <form className='form_carga' id="form_carga">
                <div className="container_carga_imagen" onClick={() => document.getElementById('inputFile').click()}>
                    <RiImageAddFill/>
                    <h6>Cargar imagen</h6>
                    <div className="img_carga" id="containerImagenMostrada">
                        <img id="imagenMostrada" src=""/>
                    </div>
                    <input type="file" class="custom-file-input" id="inputFile" name="inputFile" accept="image/*" onChange={() => mostrarImagen()} />
                </div>
                <p>Te recomendamos que la imagen tenga un tamaño de 500 x 500 px en formato PNG.</p>
                <label htmlFor="nombre">Nombre <span>*</span></label><br />
                <input type="text" name="nombre" id="nombre" /><br />
                <label htmlFor="descripcion">Descripción</label><br />
                <input type="text" name="descripcion" id="descripcion" /><br />
                <label htmlFor="selectCategory">Categoria <span>*</span></label><br />
                <div className='container_select_category'>
                    <select name="selectCategory" id="selectCategory">
                        {allCategories? allCategories.map(categoria => {
                            return <option value={categoria.id} key={categoria.id}>{categoria.categoria}</option>
                        }): (
                            <div className="productNotFound">
                                <h1>No se encontraron las categorias"</h1>
                            </div>
                        )}
                    </select><br />
                    {/* Añadir que al precionar el siguiente boton de abra una ventana modal para añadir una categoria*/}
                    <button className='add_category' type="button" onClick={() => setAddCategory(true)}><FaPlus/></button>
                </div>
                <label htmlFor="precio">Precio <span>*</span></label><br />
                <input type="text" name="precio" id="precio" onChange={evt => parseFloat(evt.target.value)? document.getElementById('precio').value = parseFloat(evt.target.value) : document.getElementById('precio').value = ""}/><br />
                <button type="button" onClick={() => cargarProducto()}>Cargar Producto</button>
            </form>

            <div className={`containerModal ${addCategory? 'activecontainerModal' : ''}`}>
                <div className={`Modal ${addCategory? 'activeModal' : ''}`}>
                    {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="Hicon-close"
                        onClick={function(){setAddCategory(false); document.getElementById("nuevaCategoria").value = "";}}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <h6>Nueva categoria</h6>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <label htmlFor="nuevaCategoria">Categoria:</label>
                        <input type="text"
                            name='nuevaCategoria'
                            id='nuevaCategoria'
                            placeholder='Nueva categoria'
                            autoComplete='off'/>
                        <input type="button" 
                            value="Añadir categoria"
                            onClick={() => addNewCategory()}/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Carga