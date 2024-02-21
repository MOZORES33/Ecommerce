import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
/* Importamos axios para realizar llamadas a la api */
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
/* Importamos el componente Alerta que permite mostrar mensajes al usuario */
import { Alerta } from './utils/Alerta/Alerta.jsx';
/* Importamos los componentes Routes, Route y HashRouter al cual asignamos el alias Router para manejar las rutas de la pagina */
import { HashRouter as Router, Routes, Route } from "react-router-dom";
/* Importamos el componente Loading que permite mostrar una animación de carga cuando otro componente demore en cargar */
import Loading from './utils/Loading/Loading.jsx';
/* Importamos todos los componentes de la pagina y los almacenamos en constantes utilizando lazy para poder mostrar la animacion de carga en caso de ser necesario */
const Header = lazy(() => import('./Components/Header/Header'));
const Main = lazy(() => import('./Components/Main/Main'));
const Footer = lazy(() => import('./Components/Footer/Footer'));
const Error404 = lazy(() => import('./utils/404/Error404.jsx'));
const Signup = lazy(() => import('./Components/Auth/Signup.jsx'));
const Register = lazy(() => import('./Components/Auth/Register.jsx'));
const Compras = lazy(() => import('./Components/Purchases/Compras.jsx'));
const Carga = lazy(() => import('./Components/administration/Carga.jsx'));
const Eliminar_producto = lazy(() => import('./Components/administration/Eliminar_producto.jsx'));

function App() {
    /* product será utilizada para almacenar los productos luego de filtrarlos por categoria */
    let product = {};
    /* alertaModal será utilizada para definir si debe mostrarse una alerta y cual de ellas será. Le asignamos el valor 0 para que no se muestre ninguna alerta al iniciar la pagina. */
    const [alertaModal, setAlertaModal] = useState(0);
    /* Declaramos la constante allproducts para almacenar los productos del carrito y le asignamos como valor una matriz vacia */
    const [allProducts, setAllProducts] = useState([]);
    /* Declaramos la constante total para almacenar el monto total de la suma de los productos del carrito y le asignamos el valor 0 */
    const [total, setTotal] = useState(0);
    /* Declaramos la constante countProducts para almacenar la cantidad total de productos del carrito y le asignamos el valor 0 */
    const [countProducts, setCountProducts] = useState(0);
    /* Declaramos la constante categorias para almacenar la categoria de productos que se debe mostrar y le asignamos el valor 'OFERTAS' para que sea la primera categoria que se muestre */
    const [categorias, setCategorias] = useState('CELULARES');
    /* La constante response será utilizada para almacenar todos los productos enviados por la api sin filtrar por categoria. */
    const [response, setResponse] = useState(null);
    /* Declaramos la constante products para almacenar los productos que se deben mostrar y le asignamos como valor el contenido de la variable product */
    const [products, setProducts] = useState(product);
    /* La constante allCategories será utilizada para almacenar todas las categorias enviadas por la api. */
    const [allCategories, setAllCategories] = useState([]);
    /* Declaramos la constante animate para indicar si se debe mostrar una animacion y le asignamos el valor 0 */
    const [animate, setAnimate] = useState(0);
    /* Declaramos la constante contacto para indicar si se debe mostrar el formulario de contacto y le asignamos el valor false*/
    const [contacto, setContacto] = useState(false);
    /* Con la constante admin definimos si el usuario es el administrador de la pagina y en caso de que lo sea agregamos opciones a la barra de navegación. */
    const [admin, setAdmin] = useState(false);
    /* Con las constantes sectionProductos y sectionInicio hacemos referencia a secciónes de la pagina para mover el scroll a dichas secciones cuando sea necesario. */
    const sectionProductos = useRef(null),
    sectionInicio = useRef(null);

    useEffect(() => {
        /* Con la constante fetchData realizamos una llamada asincrona a la api para obtener los productos y las categorias existentes */
        const fetchData = async () => {
            try {
                // En caso de querer que funcione en el telefono (Debe estar en la misma red de la pc) cambiar localhost por la ip de la Pc de la siguiente manera:
                // let dataResponse = await axios.get('http://193.158.3.10:5000/productos')
                let dataResponse = await axios.get('http://localhost:3977/products_categories_token', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    timeout: 10000, // Tiempo máximo de 5 segundos
                })
                /* En caso de error mostramos una alerta indicando el error y finalizamos la ejecución de la funcion */
                if(dataResponse.data[0][0].toString() === 'error'){
                    setAlertaModal(1);
                    return
                }
                /* Almacenamos en products los productos luego de filtrarlos por categoria */
                setProducts(product = (dataResponse.data[0][0].filter((dato) =>
                    dato.categoria.toLowerCase().includes('celulares'.toLocaleLowerCase()))))
                /* Almacenamos en response todos los productos sin filtarlos por categoria */
                setResponse(dataResponse.data[0][0]);
                /* Almacenamos en allCategories todas las categorias */
                setAllCategories(dataResponse.data[1][0]);
                /* Verificamos si el usuario es administrador y en caso de serlo, ingresamos true en la constante admin */
                if(dataResponse.data[2] === true)
                    setAdmin(true)
            } catch (error) {
                /* En caso de error al realizar la llamada a la api mostramos una alerta indicando que hubo un error */
                setAlertaModal(1)
            }
        };
        /* Ejecutamos la función fetchData */
        fetchData();
    }, []);

    return (
        <div className="App">
            {/* Verificamos si debemos mostrar una alerta comparando el valor de alertaModal con el valor de cada una de las alertas disponibles */}
            {alertaModal === 1 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}

            {/* Utilizamos el alias Router que hace referencia al componente BrowserRouter para proveer de rutas a la aplicación */}
            <Router>
                {/* Con Suspense cargamos el componente Loading en caso de demoras al cargar los demás componentes. */}
                <Suspense fallback={<Loading/>}>
                    {/* Iniciamos el componente y le pasamos los parametros necesarios */}
                    <Header allProducts = {allProducts} setAllProducts = {setAllProducts} 
                        total = {total} setTotal = {setTotal} 
                        countProducts = {countProducts} setCountProducts = {setCountProducts}
                        setProducts = {setProducts}
                        setCategorias = {setCategorias}
                        animate = {animate} setAnimate = {setAnimate}
                        contacto = {contacto} setContacto = {setContacto}
                        sectionProductos = {sectionProductos}
                        sectionInicio = {sectionInicio}
                        data = {response}
                        allCategories = {allCategories}
                        admin = {admin}
                        setAdmin = {setAdmin}/>

                    {/* Utilizamos el componente Routes que se encarga de renderizar el componente Route cuya ruta coincida con la URL ingresada por el usuario */}
                    <Routes>
                        {/* Utilizamos el componente Route para llamar a los componentes que necesitamos cargar en caso de que el usuario ingrese una ruta especifica */}
                        <Route path="/" element={<>
                            <Suspense fallback={<Loading/>}>
                                <Main allProducts = {allProducts} setAllProducts = {setAllProducts} 
                                    total = {total} setTotal = {setTotal} 
                                    countProducts = {countProducts} setCountProducts = {setCountProducts}
                                    products = {products}
                                    categorias = {categorias}
                                    setAnimate = {setAnimate}
                                    sectionProductos = {sectionProductos}
                                    sectionInicio = {sectionInicio}/>
                            </Suspense>
                        </>} />
                        <Route path='/login' element={
                            <Suspense fallback={<Loading/>}><Signup setAdmin = {setAdmin}/></Suspense>}/>
                        
                        <Route path='/register' element={
                            <Suspense fallback={<Loading/>}><Register/></Suspense>}/>
                        
                        <Route path='/compras' element={
                            <Suspense fallback={<Loading/>}><Compras/></Suspense>}/>
                        
                        <Route path='/agregar_producto' element={
                            <Suspense fallback={<Loading/>}>
                                <Carga allCategories = {allCategories}
                                setAllCategories = {setAllCategories}/>
                            </Suspense>}/>

                        <Route path='/eliminar_producto' element={
                            <Suspense fallback={<Loading/>}>
                                <Eliminar_producto response = {response}
                                setResponse = {setResponse}/>
                            </Suspense>}/>

                        {/* En caso de que la URL ingresada por el usuario no coincida con la ruta de ningun Route, cargamos el componente Error404 */}
                        <Route path='*' element={<Suspense fallback={<Loading/>}><Error404/></Suspense>}/>
                    </Routes>
                    
                    <Footer
                        setProducts = {setProducts}
                        setCategorias = {setCategorias}
                        setContacto = {setContacto}
                        sectionProductos = {sectionProductos}
                        sectionInicio = {sectionInicio}
                        data = {response}/>
                </Suspense>
            </Router>
        </div>
    );
}

export default App;
