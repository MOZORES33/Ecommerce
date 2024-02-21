import React from 'react';
import './Header.css';
import { Alerta } from '../../utils/Alerta/Alerta.jsx';
// Importamos los Hooks useState y useEffect
import { useState, useEffect} from 'react';
// Importamos el logo de la tienda de ropa
import logoImg from '../../assets/img/logo.png';
/* Importamos Link de react-router-dom que permite redirigirnos a otras paginas de manera similar que la etiqueta "<a><a/>"*/
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Este componente es la barra de navegación
const Header = ({allProducts, setAllProducts, total, setTotal, countProducts, setCountProducts, setProducts, setCategorias, animate, setAnimate, contacto, setContacto, sectionProductos, sectionInicio, data, allCategories, admin, setAdmin}) => {
    /*Declaramos la variable ubicacionPrincipal y le asignamos el valor actual del scroll en pixeles cada vez que se renderiza la pagina*/
    let ubicacionPrincipal = window.scrollY;
    /*Declaramos la variable Desplazamiento_Actual*/
    let Desplazamiento_Actual;
    const [alertaModal, setAlertaModal] = useState(0);
    const [allProductsMessaje, setAllProductsMessaje] = useState("")
    const [shoppingHistory, setShoppingHistory] = useState("")
    /* Constante active sirve para determinar si se deben mostrar los datos del carrito de compras*/
    const [active, setActive] = useState(false);
    /* Constante barsAnimate sirve para determinar si se debe activar el menu hamburguesa en resoluciones con un ancho menor a 1030px*/
    const [barsAnimate, setbarsAnimate] = useState(false);
    /*Declaramos la constante Scroll que determina si se debe ocultar la barra de navegacion y le almacenamos el valor booleano false, lo que significa que no se debe ocultar*/
    const [Scroll, setScroll] = useState(false);
    const scrollToSection = (ref) => {
        if (ref.current) {
          ref.current.scrollIntoView();
        }
    };
    const navigate = useNavigate();
    const [userDelete, setUserDelete] = useState(false)
    const [password, setPassword] = useState('');
    const inputChange = ({target}) => {
        const {name, value} = target
        setPassword({[name]: value})
    }
    const [userUpdate, setUserUpdate] = useState(false)
    const [body, setBody] = useState({newPassword: '', passwordActual: ''});
    const newPasswordChange = ({target}) => {
        const {name, value} = target
        setBody({
            ...body,
            [name]: value})
    }

    /*Funcion para eliminar un producto del carrito de compras que recibe como parametro los datos del producto a eliminar*/
    function onDeleteProduct(product){
        /*Almacenamos en la constante allProducts los datos de los productos del carrito luego de eliminar el producto que se recibió como parametro. Para eliminar dicho producto se utiliza la funcion filter para almacenar todos los productos cuyo id sea distinto al id del producto recibido como parametro*/
        setAllProducts(allProducts.filter(item => item.id !== product.id));

        /*Almacenamos en la constante total el nuevo monto luego de descontar el precio del producto eliminado por la cantidad del mismo*/
        setTotal(total - product.precio * product.stock);
        /*Almacenamos en la constante countProducts la nueva contidad luego de descontar la cantidad del producto eliminado*/
        setCountProducts(countProducts - product.stock);
        /*Llamamos a la funcion animationSubstract para que se ejecute una animacion*/
        animationSubstract('-' + product.stock);
    };
    
    /*Funcion para eliminar todos los productos del carrito*/
    function onCleanCart() {
        /*Asignamos una matriz vacia a la constante allProducts*/
        setAllProducts([])
        /*Llamamos a la funcion animationSubstract para que se ejecute una animacion*/
        animationSubstract('-' + countProducts)
        /*Asignamos el valor 0 a la constante countProducts*/
        setCountProducts(0)
        /*Asignamos el valor 0 a la constante total*/
        setTotal(0)
        setActive(false)
    };

    /*Cada vez que se realize un scroll se ejecuta la siguiente funcion que sirve para ocultar o mostrar la barra de navegacion*/
    window.onscroll = function(){
        /*Se utiliza un if para varificar si se cumplen tres condiciones. si el ancho de pantalla es mayor a 600px / si el carrito se esta mostrando / si el menu se está mostrando. En caso de que se cumpla alguna de estas condiciones se asigna el valor false a la constante Scroll por lo que no se oculta la barra de navegación y con el return finaliza la funcion.*/
        if(window.innerWidth > 600 || active === true || barsAnimate === true){
            setScroll(false);
            return;
        }
        /*Se asigna la nueva ubicacion del scroll a la variable Desplazamiento_Actual*/
        Desplazamiento_Actual = window.scrollY;
        /*Se compara si la nueva ubicacion del scroll es menor a la ubicacion anterior. en caso de que se cumpla la condicion se asigna a la constante Scroll el valor false, por lo que no se oculta la barra de navegación*/
        if(ubicacionPrincipal >= Desplazamiento_Actual){
            setScroll(false);
        }
        /*En caso de que no se cumpla la condicion anterior se verifica si Desplazamiento_Actual es mayor a 40. En caso de que se cumpla dicha condicion se asigna a la constante Scroll el valor true, por lo que se oculta la barra de navegación*/
        else if(Desplazamiento_Actual > 40){
            setScroll(true);
        }
        /*Asignamos la nueva ubicación del scroll a la variable UbicacionPrincipal*/
        ubicacionPrincipal = Desplazamiento_Actual;
    }

    /*Funcion para filtrar los productos por categorias*/
    function selectCategoria(filterCategory){
        /*Cerramos el menu de navegación. esto sirve si el ancho de pantalla es menor a 600px*/
        setbarsAnimate(false);
        if(data === null){
            setCategorias(filterCategory.toUpperCase())
            return
        }
        /*Filtramos los productos utilizando la funcion filter para comparar si las categorias de los productos almacenados en data contienen el nombre de la categoria recibida por el parametro filter. El resultado lo almacenamos en la constante products*/
        setProducts(data.filter((dato) =>
        dato.categoria.toLowerCase().includes(filterCategory.toLocaleLowerCase())))
        /*Almacenamos en la constante categorias el valor del parametro filter en mayusculas*/
        setCategorias(filterCategory.toUpperCase())

        scrollToSection(sectionProductos)
    }

    /*Funcion para ejecutar una animación*/
    function animationSubstract(number){
        /*Asignamos el valor recibido como parametro al elemento con id 'animado'*/
        document.getElementById('animado').textContent = number;
        /*Asignamos el color rgb(255, 0, 0) al elemento con id 'animado'*/
        document.getElementById('animado').style.color = "rgb(255, 0, 0)";
        /*Asignamos el valor 2 a la constante animate*/
        setAnimate(2)
        /*Con setTimeout ejecutamos una funcion para asignar un valor nulo al elemento con id 'animado' y el valor 0 a la constante animate luego de haber transcurrido 300ms*/
        setTimeout(function(){document.getElementById('animado').textContent = '';
        setAnimate(0)}, 300)
    }
    
    function SignOff(){
        localStorage.setItem('token', '')
        setAdmin(false)
        navigate("/login");
    }

    function selectConfigUser(action){
        axios.get('http://localhost:3977/token', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 10000 // Tiempo máximo de 10 segundos
          })
        .then(({data}) => {
          if(data.toString() === 'existe'){
            if(action === 'update')
                setUserUpdate(true)
            else if(action === 'delete')
                setUserDelete(true)
            return
          }
          setAlertaModal(2)
        })
        .catch(() => {
            setAlertaModal(1)
        })
    }

    // Eliminar usuario
    function deleteUser(){
        axios.post('http://localhost:3977/deleteUser', password, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 10000 // Tiempo máximo de 10 segundos
        })
        .then(({data}) => {
            if(data.toString() === 'error1'){
                setUserDelete(false)
                document.getElementById("password").value = "";
                localStorage.setItem('token', '')
                setPassword('')
                setAlertaModal(2)
            }
            else if(data.toString() === 'error2'){
                setAlertaModal(1)
            }
            else if(data.toString() === 'inexistente'){
                setAlertaModal(4)
            }
            else if(data.toString() === 'correcto'){
              setUserDelete(false)
              document.getElementById("password").value = "";
              setPassword('')
              setAlertaModal(5)
              localStorage.setItem('token', '')
              navigate("/");
              return
            }
        })
        .catch(function () {
            setAlertaModal(1)
        })
    }

    // Actualizar contraseña
    function updatePassword(){
        if(body.newPassword.length < 8){
            setAlertaModal(6)
            return
        }
        axios.post('http://localhost:3977/updateUser', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 10000 // Tiempo máximo de 10 segundos
        })
        .then(({data}) => {
            
            if(data.toString() === 'error1'){
                setUserUpdate(false)
                document.getElementById("passwordActual").value = "";
                document.getElementById("newPassword").value = "";
                setBody({newPassword: '', password: ''})
                setAlertaModal(2)
            }
            else if(data.toString() === 'error2'){
                setAlertaModal(4)
            }
            else if(data.toString() === 'exito'){
              setUserUpdate(false)
              document.getElementById("passwordActual").value = "";
              document.getElementById("newPassword").value = "";
              setBody({newPassword: '', password: ''})
              setAlertaModal(7)
              navigate("/");
              return
            }
        })
        .catch(() => {
            setAlertaModal(1)
        })
    }

    function cargarCompra(){
        const body = {shoppingHistory, total}
        axios.post('http://localhost:3977/cargar-venta', body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            timeout: 10000 // Tiempo máximo de 10 segundos
        })
        .then(({data}) => {
            if(data.toString() === 'error1' || data.toString() === 'inexistente'){
                setActive(false);
                setAlertaModal(2)
            }
            else if(data.toString() === 'error2'){
                setActive(false);
                setAlertaModal(8)
            }
            else if(data.toString() === 'correcto'){
                onCleanCart();
                setActive(false);
                const numeroTelefono = '3865-396343';  // Reemplaza con el número de teléfono deseado
                const mensaje = `Hola, quisiera comprar estos productos:%0A_______________%0A%0A${allProductsMessaje}*Total*: $${total}`;
                
                const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${mensaje}`;
                window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
                return
            }
        })
        .catch(() => {
            setAlertaModal(1)
        })
    }
    
    function navigateLogin(){
        navigate("/login")
    };
    
    /* Con useEffect verificamos al realizarse el primer renderizado de la pagina si hay productos del carrito almacenados en localStorage, en caso de que se encuentren productos se añaden a la constante allProducts que contiene los productos del carrito. Tambien se modifican las constantes countProducts y total que contienen la cantidad total de productos almacenados en el carrito de compras y el monto total de los productos respectivamente.*/
    useEffect(() => {
        let cart = localStorage.getItem('cart')
        let count = localStorage.getItem('count')
        let total = localStorage.getItem('total')
        if(cart){
            /*en este caso utilizamos JSON.parse para convertir los productos del carrito que fueron almacenados como string en el localStorage a una matriz para poder almacenarlos en allProducts*/
            setAllProducts(JSON.parse(cart))
            setCountProducts(parseFloat(count))
            setTotal(parseFloat(total))
        }
    }, [ ])

    /*Con useEffect guardamos los datos del carrito en el localStorage cada vez que se modifique la constante allProducts que contiene los productos del carrito*/
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(allProducts))
        localStorage.setItem('count', countProducts)
        localStorage.setItem('total', total)
        if (!allProducts){
            return
        }
        let productsMessaje = "";
        let productsApi;
        let productsApiJSON;
        for (const product of allProducts){
            productsMessaje += "*Nombre*: " + product.nombre + "%0A";
            productsMessaje += "*Precio*: $" + product.precio + "%0A";
            productsMessaje += "*Cantidad*: " + product.stock + "%0A";
            productsMessaje += "_______________%0A%0A";

            productsApi = allProducts.map(function(producto) {
                return {
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stock: producto.stock
                };
            });
            productsApiJSON = JSON.stringify(productsApi);
        }
        setAllProductsMessaje(productsMessaje)
        // setShoppingHistory(letShoppingHistory)
        setShoppingHistory(productsApiJSON)
    }, [allProducts])

    return (
        <div className='header' ref={sectionInicio}>
            {alertaModal === 1 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}
            {alertaModal === 2 && Alerta(setAlertaModal, 'Su sesión expiró.', 'Debe inicar sesión nuevamente para continuar.', 1, 'Aceptar', navigateLogin)}
            {alertaModal === 3 && Alerta(setAlertaModal, '¿Confirmas que deseas vaciar el carrito?', '', 2, 'Cancelar', undefined, 'Aceptar', onCleanCart)}
            {alertaModal === 4 && Alerta(setAlertaModal, 'Contraseña incorrecta.', 'Ingresa una contraseña valida', 1, 'Aceptar')}
            {alertaModal === 5 && Alerta(setAlertaModal, 'Usuario eliminado correctamente', '', 1, 'Aceptar')}
            {alertaModal === 6 && Alerta(setAlertaModal, 'La nueva contraseña debe ser mayor a 8 caracteres', '', 1, 'Aceptar')}
            {alertaModal === 7 && Alerta(setAlertaModal, 'Contraseña actualizada correctamente', '', 1, 'Aceptar')}
            {alertaModal === 8 && Alerta(setAlertaModal, 'Ocurrió un error al intentar cargar la compra y no aparecerá en el historial.', 'Por favor intente nuevamente mas tarde.', 1, 'Aceptar')}

            {/* Linkeamos un archivo con extensión css que servira para utilizar algunos iconos*/}
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
            {/* Asignando las clases de esta manera podemos verificar si se cumple una condicion para asignar una clase.*/}
            {/* En este caso verificamos si el valor booleano almacenado en la constante Scroll es true. En caso de cumplirse la condicion se asigna la clase HnavUp para ocultar la barra de navegación */}
            <nav className={`Hnav ${Scroll ? 'HnavUp' : ''}`}>
                <Link className="Hnavlogo" to={"/"}><img src={logoImg} alt="logo"/></Link>
                <div className="HnavDiv">
                    {/* En caso de que barsAnimate sea true se asigna una clase para mostrar el menu. Esto sirve para dispositivos con un ancho de pantalla menor a 600px */}
                    <ul className={`HnavList ${barsAnimate ? 'HactiveNavList' : ''}`}>
                        <li className={`HnavItem ${barsAnimate ? 'HactiveNavItem' : ''}`}>
                            {/* Utilizamos la etiqueta Link para redireccionar a otra pagina del proyecto. Al utilizar esta etiqueta solo se realiza el renderizado de los componentes que no estaban cargados en la pagina. La diferencia con utilizar la etiqueta <a></a> es que dicha etiqueta recarga toda la pagina.*/}
                            <Link className="HnavLink" to="/" onClick={() => {setbarsAnimate(false); scrollToSection(sectionInicio)}}>Inicio</Link>
                        </li>
                        <li className={`HnavItem ${barsAnimate ? 'HactiveNavItem' : ''}`}>
                            {/* Al hacer click en contactanos se asigna el valor true a la constante contacto y el valor false a la variable barsAnimate. De modo que se oculta el menu (Solo se puede observar en dispositivos con ancho de pantalla inferior a 1030px) y se muestra la tarjeta de contacto.*/}
                            <p className="HnavLink" onClick={() => {setContacto(true); setbarsAnimate(false)}}>Contactanos</p>
                        </li>
                        <li className={`HnavItem ${barsAnimate ? 'HactiveNavItem' : ''}`}>
                            {/* Utilizamos la etiqueta Link para redireccionar a otra pagina del proyecto. Al utilizar esta etiqueta solo se realiza el renderizado de los componentes que no estaban cargados en la pagina. La diferencia con utilizar la etiqueta <a></a> es que dicha etiqueta recarga toda la pagina.*/}
                            <Link className="HnavLink" to="/compras"  onClick={() => {setbarsAnimate(false); scrollToSection(sectionInicio)}}>Compras</Link>
                        </li>
                        <li className={`HnavItem ${barsAnimate ? 'HactiveNavItem' : ''}`}>
                            <p className="HnavLink">Categorias <i className="Htoggle-dropdown dropdown-toggle"></i></p>
                            <ul className={`Hdropdown ${barsAnimate ? 'HactiveDropdown' : ''}`}>
                                {/* Al precionar se ejecuta la funcion selectCategoria y se le envia como parametro el nombre de la categoria */}
                                <li className="HdropdowsItem" onClick={evt => selectCategoria("")}>
                                    <p className="HdropLink">Todos</p>
                                </li>
                                {allCategories? allCategories.map(categoria => {
                                    return  <li className="HdropdowsItem" onClick={evt => selectCategoria(evt.target.textContent)} key={categoria.id}>
                                                <p className="HdropLink">{categoria.categoria}</p>
                                            </li>
                                }): (
                                    <div className="productNotFound">
                                        <h1>No se encontraron las categorias"</h1>
                                    </div>
                                )}
                            </ul>
                        </li>


                        {admin? 
                        <li className={`HnavItem ${barsAnimate ? 'HactiveNavItem' : ''}`}>
                            <p className="HnavLink">Administración <i className="Htoggle-dropdown dropdown-toggle"></i></p>
                            <ul className={`Hdropdown ${barsAnimate ? 'HactiveDropdown' : ''}`}>
                                {/* Al precionar se ejecuta la funcion selectCategoria y se le envia como parametro el nombre de la categoria */}
                                <li className="HdropdowsItem" onClick={evt => selectCategoria("")}>
                                    <Link className="HdropLink" to="/agregar_producto" >Añadir producto</Link>
                                </li>
                                <li className="HdropdowsItem" onClick={evt => selectCategoria("")}>
                                    <Link className="HdropLink" to="/eliminar_producto" >Eliminar producto</Link>
                                </li>
                            </ul>
                        </li>
                        :
                        <></>
                        }
                    </ul>
                </div>
                <div className="Hcart">
                    <div className="animation">
                        {/* En caso de que el valor de la constante animate sea distinto de 0 se comprueba si es igual a 1 o 2 y se asigna la clase que corresponda. Esto es para realizar la animacion al lado del icono del carrito de compras*/}
                        <div id='animado' className={` ${animate !== 0? animate === 1? 'animateUp' : 'animateDown' : ''}`}></div>
                    </div>
                    <ul className='HcartList'>
                        {/* Se comprueba si el valor de la constante countProducts es igual a 0. En caso de cumplirse la condicion se asigna la clase Hbuy-aColor que sirve para cambiar el color del carrito */}
                        {/* Tambien cuenta con un evento onClick que asigna a la constante active su valor contrario. De manera que al precionar el carrito se pueda tanto mostrar como ocultar la lista de productos almacenados */}
                        <li className="Hbuy">
                            <div className={`Hbuy-a ${countProducts === 0 ? 'Hbuy-aColor' : ''}`} onClick={() => setActive(!active)}>
                                <i className="Hbuy-li fa fa-shopping-cart"></i>
                                {/* Se comprueba si el valor de la constante countProducts es igual a 0. En caso de cumplirse la condicion se asigna la clase Hcount-productsColor que sirve para cambiar el color de fondo del numero que indica la cantidad total de productos en el carrito */}
                                <div className={`Hcount-products ${countProducts === 0 ? 'Hcount-productsColor' : ''}`}>
                                    <span id="Hcontador-productos">{countProducts}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Verificamos si el valor de la constante active es true. En caso de no cumplirse la condicion se asigna la clase Hhidden-cart que oculta los productos del carrito */}
                <div className={`Hcontainer-cart-products ${active ? '' : 'Hhidden-cart'}`}>
                        {
                            /* Verificamos si la constante allProducts contiene algun producto almacenado. En caso de cumplirse la condicion se cargan los productos. En caso contrario se carga un mensaje indicando que el carrito está vacio. */
                            allProducts.length ? (
                                <>
                                    <div className="Hrow-product">
                                        {/* Cargamos uno por uno todos los productos almacenados en allProducts */}
                                        {allProducts.map(product => (
                                            /* Ingresamos como key el id del producto */
                                            <div className="Hcart-product" key={product.id}>
                                                <div className="Hinfo-cart-product">
                                                    {/* Ingresamos la cantidad almacenada del producto */}
                                                    <span className="Hcantidad-producto-carrito">{product.stock}</span>
                                                        {/* Ingresamos el nombre del producto */}
                                                        <p className="Htitulo-producto-carrito">{product.nombre}</p>
                                                    {/* Ingresamos el precio del producto */}
                                                    <span className="Hprecio-producto-carrito">${product.precio}</span>
                                                </div>
                                                {/* Este svg es la X y al precionarla elimina el producto del carrito */}
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="Hicon-close"
                                                    onClick={() => onDeleteProduct(product)}>
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="Hcart-total">
                                        <h3>Total:</h3>
                                        <span className="Htotal-pagar">${total}</span>
                                    </div>

                                    <div className="buttons_buy_clear">
                                        <button className="Hbtn-buy" onClick={() => {cargarCompra()}} >Comprar ahora</button>
                                        {/* <a className="Hbtn-buy" href={`https://api.whatsapp.com/send?phone=3865-396343&text=Hola, quisiera comprar estos productos:%0A_______________%0A%0A${allProductsMessaje}*Total*: $${total}`} target='_blank' rel="noopener noreferrer" onClick={() => {cargarCompra()}}>
                                            Comprar ahora
                                        </a> */}
                                        {/* Al precionar el boton se ejecuta la funcion onCloanCart que elimina todos los productos del carrito */}
                                        <button className="Hbtn-clear-all" onClick={() => {setAlertaModal(3)}}>
                                            Vaciar carrito
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="Hcart-empty">El carrito está vacío</p>
                            )
                        }
                </div>

                <div className="Hicons">
                    <ul className={`HiconList ${barsAnimate ? 'HactiveIconList' : ''}`}>
                        <li className={`Hicon ${barsAnimate ? 'HactiveIcon' : ''}`}><a className='Hfacebook' href="https://www.facebook.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-facebook"></i></a></li>
                        <li className={`Hicon ${barsAnimate ? 'HactiveIcon' : ''}`}><a className='Hinstagram' href="https://www.instagram.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-instagram"></i></a></li>
                        <li className={`Hicon ${barsAnimate ? 'HactiveIcon' : ''}`}><a className='Htwitter' href="https://twitter.com/leomessisite/" target='_blank' rel="noopener noreferrer"><i className="fa fa-twitter"></i></a></li>
                    </ul>
                </div>
                <div className="Huser">
                    <ul className='HuserList'>
                        <li className="Hlogin"><Link to="/login" onClick={() => {scrollToSection(sectionInicio); setbarsAnimate(false);}}><i className="fa fa-sign-in"></i></Link></li>
                        <li className="Hprofile"><i className="fa fa-user"></i>
                        <ul className='HConfUser'>
                            <p><i className="fa fa-gear"></i> Config. de usuario</p>
                            <li onClick={() => {setbarsAnimate(false); selectConfigUser('update');}}>Modificar contraseña</li>
                            <li onClick={() => {setbarsAnimate(false); selectConfigUser('delete');}}>Eliminar usuario</li>
                            <li onClick={() => {setbarsAnimate(false); SignOff();}}>Cerrar sesión</li>
                        </ul>
                        </li>
                    </ul>
                </div>
                <div className="Hbars__menu" onClick={() => setbarsAnimate(!barsAnimate)}>
                    <span className={`Hline1__bars-menu ${barsAnimate ? 'HactiveLine1__bars-menu' : ''}`}></span>
                    <span className={`Hline2__bars-menu ${barsAnimate ? 'HactiveLine2__bars-menu' : ''}`}></span>
                    <span className={`Hline3__bars-menu ${barsAnimate ? 'HactiveLine3__bars-menu' : ''}`}></span>
                </div>
            </nav>

            
            <div className={`containerModal ${userDelete? 'activecontainerModal' : ''}`}>
                <div className={`Modal ${userDelete? 'activeModal' : ''}`}>
                    {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="Hicon-close"
                        onClick={function(){setUserDelete(false); setPassword(''); document.getElementById("password").value = "";}}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <h6>Lamentamos que debas irte</h6>
                    <p>Para continuar debes ingresar nuevamente tu contraseña</p>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <label htmlFor="password">Contraseña:</label>
                        <input type="text"
                            name='password'
                            id='password'
                            placeholder='Contraseña'
                            autoComplete='off'
                            onChange={inputChange}/>
                        <input type="button" 
                            value="Eliminar cuenta"
                            onClick={deleteUser}/>
                    </form>
                </div>
            </div>
            

            <div className={`containerModal ${userUpdate? 'activecontainerModal' : ''}`}>
                <div className={`Modal ${userUpdate? 'activeModal' : ''}`}>
                    {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="Hicon-close"
                        onClick={function(){setUserUpdate(false); setBody({newPassword: '', password: ''}); document.getElementById("passwordActual").value = ""; document.getElementById("newPassword").value = "";}}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <h6>Actualización de contraseña</h6>
                    <form >
                        <label htmlFor="passwordActual">Contraseña actual:</label>
                        <input type="text"
                            name='passwordActual'
                            id='passwordActual'
                            placeholder='Contraseña actual'
                            autoComplete='off'
                            onChange={newPasswordChange}/>

                        <label htmlFor="newPassword">Nueva contraseña:</label>
                        <input type="text"
                            name='newPassword'
                            id='newPassword'
                            placeholder='Nueva contraseña'
                            autoComplete='off'
                            onChange={newPasswordChange}/>

                        <input type="button" 
                            value="Modificar contraseña"
                            onClick={updatePassword}/>
                    </form>
                </div>
            </div>

            {/* Formulario de contacto */}
            {/* Se comprueba si contacto es true. En caso de cumplirse la condicion se asigna la clase para mostrar el formulario de contacto. */}
            <div className={`containerModal ${contacto? 'activecontainerModal' : ''}`}>
                <div className={`Modal ${contacto? 'activeModal' : ''}`}>
                    {/* Este svg es la X y al precionarla cierra el formulario de contacto. */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="Hicon-close"
                        onClick={() => setContacto(false)}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    <h6>Gamer Store - Contactos</h6>
                    <ul className='contactanos'>
                        {/* Redirigimos a la ubicacion de la empresa en google maps */}
                        <li className='contactos'><a className='direccion' href="https://www.google.com.gt/maps/place/La+Oferta/@-27.3477648,-65.5910017,18z/data=!4m10!1m2!2m1!1sla+oferta!3m6!1s0x9423cf5c99bfe997:0x1e14071c27ac474d!8m2!3d-27.3466769!4d-65.5894634!15sCglsYSBvZmVydGFaCyIJbGEgb2ZlcnRhkgEOY2xvdGhpbmdfc3RvcmXgAQA!16s%2Fg%2F11b7xmqvg8?entry=ttu" target='_blank' rel="noopener noreferrer"><i className="mail fa fa-map-marker"></i> Buenos Aires 60, Concepción, Tucumán, Argentina.</a></li>
                        {/* Redirigimos a un chat de WhatsApp de la empresa con un mensaje predeterminado */}
                        <li className='contactos'><a className='whatsapp' href="https://api.whatsapp.com/send?phone=3865-396343&text=Hola, estoy interesado en comprar tus productos" target='_blank' rel="noopener noreferrer"><i className="fa fa-whatsapp"></i> WhatsApp</a></li>
                        {/* Redirigimos a la aplicación de telefono con el numero de la empresa ingresado para poder llamar o agregar el contacto */}
                        <li className='contactos'><a className='celular' href="tel:+5493865-396343" target='_blank' rel="noopener noreferrer"><i className="fa fa-phone"></i> +54 9 3865-396343</a></li>
                        {/* Redirigimos a la aplicacion de correo electronico predeterminada para enviar un correo a la empresa con un asunto predeterminado */}
                        <li className='contactos'><a className='mail' href="mailto:GameStore@gmail.com?Subject=Me%20Interesa%20un%20producto" target='_blank' rel="noopener noreferrer"><i className="mail fa fa-envelope-o"></i> GameStore@gmail.com</a></li>
                    </ul>
                    <h6>Nuestras redes sociales</h6>
                    <div className="HiconsContact">
                        <a className='HiconContact' href="https://www.facebook.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-facebook"></i></a>
                        <a className='HiconContact' href="https://www.instagram.com/leomessi/" target='_blank' rel="noopener noreferrer"><i className="fa fa-instagram"></i></a>
                        <a className='HiconContact' href="https://twitter.com/leomessisite/" target='_blank' rel="noopener noreferrer"><i className="fa fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
