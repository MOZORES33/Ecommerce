import React from 'react'
import './Footer.css';
import { Link } from 'react-router-dom';

// Este componente es el pie de pagina
const Footer = ({setProducts, setCategorias, setContacto, sectionProductos, sectionInicio, data}) => {
    /*Funcion para filtrar los productos por categorias*/
    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    };
    
    function selectCategoria(filter, section){
        /*Filtramos los productos utilizando la funcion filter para 
        comparar si las categorias de los productos almacenados en 
        data contienen el nombre de la categoria recibida por el 
        parametro filter. El resultado lo almacenamos en la constante 
        products*/
        setProducts(data.filter((dato) =>
            dato.categoria.toLowerCase().includes(filter.toLocaleLowerCase())))
        /*Almacenamos en la constante categorias el valor del 
        parametro filter en mayusculas*/
        setCategorias(filter.toUpperCase())
        scrollToSection(section)
    }

    return (
        <div className="footer">
            <div className='sb__footer section__padding'>
                <div className='sb__footer-links'>
                    <div className='sb__footer-links_div'>
                        <h4>Menu</h4>
                        <Link to="/" onClick={() => scrollToSection(sectionInicio)}>
                        <p>Inicio</p>
                        </Link>
                        {/* Abrimos el formulario de contacto */}
                        <p id='contacto' onClick={() => setContacto(true)}>Contactanos</p>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Productos</h4>
                        {/* Con el evento onClick seleccionamos la categoria */}
                        <p onClick={evt => selectCategoria(evt.target.textContent, sectionProductos)}>Celulares</p>
                        <p onClick={evt => selectCategoria(evt.target.textContent, sectionProductos)}>Componentes</p>
                        <p onClick={evt => selectCategoria(evt.target.textContent, sectionProductos)}>Tablets</p>
                        <p onClick={evt => selectCategoria(evt.target.textContent, sectionProductos)}>Impresoras</p>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Redes sociales</h4>
                        <div className='icon'>
                        <ul className='iconLista'>
                            <li className="iconos"><a className='facebook' href="https://www.facebook.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-facebook"></i></a></li>
                            <li className="iconos"><a className='instagram' href="https://www.instagram.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-instagram"></i></a></li>
                            <li className="iconos"><a className='twitter' href="https://twitter.com/leomessisite/" target='_blank' rel="noopener noreferrer"><i className="fa fa-twitter"></i></a></li>
                        </ul>
                        </div>
                    </div>
                </div>
                
                <hr />
                <div className='sb__footer-below'>
                    <div className='sb__footer-below-links'>
                        <a href="#"><p>Terminos y Condiciones</p></a>
                        <a href="#"><p>Politica de Privacidad</p></a>
                        <a href="#"><p>Seguridad</p></a>
                        <a href="#"><p>Cookies</p></a>
                    </div>
                </div>
                <div className='sb__footer-copyright'>
                    <p>
                        ©{new Date().getFullYear()} Game-Store. Aguilares, Tucumán.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer
