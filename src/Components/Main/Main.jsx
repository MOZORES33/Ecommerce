import React, { useState, useEffect } from 'react'
import './Main.css'
import slider1 from '../../assets/img/Slider/slider1.jpg';
import slider2 from '../../assets/img/Slider/slider2.jpg';
import slider3 from '../../assets/img/Slider/slider3.jpg';
import slider4 from '../../assets/img/Slider/slider4.jpg';

// Este componente es el cuerpo de la pagina
const Main = ({allProducts, setAllProducts, countProducts, setCountProducts, total, setTotal, products, categorias, setAnimate, sectionProductos, sectionInicio}) => {
    const [detailModal, setDetailModal] = useState(false);
    const [productModal, setProductModal] = useState({});
    const images = [slider1, slider2, slider3, slider4];
    const [animation, setAnimation] = useState(0);
    const [timeInterval, setTimeInterval] = useState(5000);
    // Metodo para añadir productos al carrito
    const onAddProduct = product => {
        /* Verificamos si el id del producto coincide con el id de algun 
        producto almacenado en el carrito */
        if(allProducts.find(item => item.id === product.id)){
            const products = allProducts.map(item => item.id === product.id? {...item, stock: item.stock + 1} : item);
            setTotal(total + product.precio * product.stock);
            setCountProducts(countProducts + product.stock);
            animationSum();
            return setAllProducts([...products]);
        }
        /* Si no se cumple la condición agregamos el producto al carrito.
        */
        /* Asignamos a la constante total el nuevo monto sumando el 
        precio por la cantidad del producto agregado */
        setTotal(total + product.precio * product.stock);
        /* Asignamos a la constante countProducts la nueva cantidad 
        sumando la cantidad agregada */
        setCountProducts(countProducts + product.stock);
        /* Asignamos a la variable allProducts los productos agregados 
        anteriormente mas el nuevo producto */
        setAllProducts([...allProducts, product]);
        /* Llamamos a la funcion animationSum para iniciar una animación 
        */
        animationSum();
    };
    
    /* Funcion para iniciar una animacion */
    function animationSum(){
        /* Asignamos el valor +1 al elemento con id 'animado' */
        document.getElementById('animado').textContent = '+1';
        /* Asignamos un color al elemento con id 'animado' */
        document.getElementById('animado').style.color = "rgb(13, 255, 0)";
        /* Asignamos el valor 1 a la constante animate */
        setAnimate(1)
        /* Con la función setTimeout asignamos un valor nulo al elemento 
        con id 'animado' y el valor 0 a la constante animate luego de 
        haber transcurrido 300ms */
        setTimeout(function(){document.getElementById('animado').textContent = ''
            setAnimate(0)
        }, 300)
    }
    
    function nextImage(time){
        setTimeInterval(time)
        if(animation !== images.length - 1)
            setAnimation(animation + 1)
        else
            setAnimation(0)
    }
    
    function prevImage(time){
        setTimeInterval(time)
        if(animation !== 0)
            setAnimation(animation - 1)
        else
            setAnimation(images.length - 1)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage(5000);
        }, timeInterval);
        return() => clearInterval(interval);
    });

    return (
        <div className="main" >
            <div className="containerSliderPrincipal">
                <div className="sliderPrincipal" id='sliderPrincipal'>
                    {images.length ? images.map((image, index) => (
                        // Creamos un div y le añadimos la clase card y el id del producto con product.id
                        <div className={`sliderSection ${animation === index ? 'carrouselActive' : ''}`} key={'imageSlider' + index}>
                            <img src={image} alt="" className={'imgSliderPrincipal'} />
                        </div>
                    )): (
                        <div className="sliderNotFound">
                            <h1>"La Familia"<br/>Distribuidora</h1>
                        </div>
                    )}
                </div>
                <div className="containerBtn sliderbtnLeft" id='sliderbtnLeft' onClick={() => prevImage(10000)}><i className='fa fa-angle-left'/></div>
                <div className="containerBtn sliderbtnRight" id='sliderbtnRight' onClick={() => nextImage(10000)}><i className='fa fa-angle-right'/></div>
            </div>
            
            {/* Mostramos con el h1 el valor de la constante categoria */}
            <h1 className='title' ref={sectionProductos}>{categorias !== ""? categorias : "TODOS"}</h1>
            <div className="container_card">
                {/* Comprobamos si products es distinto de nulo. En caso de cumplirse la condicion se muestran los productos. En caso contrario se muestra un mensaje indicando que no se encontraron productos */}
                {/* Aquí ejecutamos un map para mostrar todos los productos que se encuentran cargados en el archivo data.js */}
                {/* Con la constante product vamos añadiendo todos los productos que se encuentran en data.js */}
                {products.length ? products.map(product => (
                    // Creamos un div y le añadimos la clase card y el id del producto con product.id
                    <div className="card" key={product.id}>
                        {/* Cargamos la imagen con product.urlImage y el nombre del producto en alt con product.nombre */}
                        <center>   <img src={`http://localhost:3977/imagenes/${product.urlImage}`} alt={product.urlImage} /> </center>
                        {/* Mostramos el nombre del producto con product.nombre */}
                        <h6>{product.nombre}</h6>
                        {/* Mostramos el precio del producto con product.precio */}
                        <p>${product.precio}</p>
                        <div className="detail_product">
                            <p onClick={() => {setDetailModal(true); setProductModal(product)}}>Ver detalles</p>
                        </div>
                        {/* Creamos un boton y le añadimos el evento onClick para que cuando se precione ejecute el metodo onAddProduct que añade el producto al carrito*/}
                        <button onClick={() => onAddProduct(product)}>Añadir al carrito</button>
                    </div>
                )): (
                    <div className="productNotFound">
                        <h1>No se encontraron productos en la categoria "{categorias !== ""? categorias : "TODOS"}"</h1>
                    </div>
                )}
            </div>
            
            <div className={`container_modal_products_details ${detailModal? 'activecontainerModal' : ''}`}>
                <div className="container_details">
                
                    {productModal ? (
                        <div className="card_details">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="Hicon-close"
                                onClick={() => {setDetailModal(false); setProductModal({})}}>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            <div className="card__image">
                                <img src={productModal.urlImage? `http://localhost:3977/imagenes/${productModal.urlImage}`: ""} alt={productModal.urlImage} />
                            </div>
                            <div className="card__content">
                                <div className="card__content__tag">
                                    <span className="tag">{productModal.categoria ? productModal.categoria: ""}</span>
                                </div>
                                <p className="card__content__title">{productModal.nombre}</p>
                                <p className="card__content__info">{productModal.descripcion}</p>
                                <div className="card__content__config">
                                    <div className="price">
                                        <span className="price">${productModal.precio}</span>
                                    </div>
                                </div>
                                <button className='card__content__action' onClick={() => onAddProduct(productModal)}><i className="fa fa-shopping-cart"></i> Añadir al carrito</button>
                            </div>
                        </div>
                    ) : (
                        <div className="productNotFound">
                            <h1>Ocurrió un error al intentar mostrar el producto. Por favor intente mas tarde.</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main
