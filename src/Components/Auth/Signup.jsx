import React, { useState } from 'react'
import './Signup.css'
import { Alerta } from '../../utils/Alerta/Alerta.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Este componente es el inicio de sesión de usuarios de la pagina
const Signup = ({ setAdmin }) => {
    const [alertaModal, setAlertaModal] = useState(0);
    const [incorrect, setIncorrect] = useState(false);
    const [body, setBody] = useState({username: '', password: ''});
    const navigate = useNavigate();
    
    const inputChange = ({target}) => {
        setIncorrect(false)
        const {name, value} = target
        setBody({
            ...body,
            [name]: value
        })
    }
    
    const onSubmit=()=>{
        axios.post('http://localhost:3977/login', body, {
            timeout: 10000, // Tiempo máximo de 10 segundos
        })
        .then(({data}) => {
            if(data.toString() === 'error'){
                setAlertaModal(1)
                return
            }
            if(data.toString() === 'false'){
                setIncorrect(true)
                return
            }
            localStorage.setItem('token', data.token)
            if (body.username === 'admin')
                setAdmin(true)
            navigate("/");
        })
        .catch(() => {
            setAlertaModal(1);
        })
    }

    return (
        <div className='signUp'>
            {alertaModal === 1 && Alerta(setAlertaModal, 'Ocurrió un error inesperado.', 'Por favor intente nuevamente mas tarde', 1, 'Aceptar')}
            <div className="containerSignUp">
                <div className="img"/>
                <h3>Inicio de sesión</h3>
                <form action="">
                    <h6>Usuario:</h6>
                    <input 
                        type="text"  
                        id="username" 
                        name="username" 
                        onChange={inputChange}
                        placeholder="Usuario"/>

                    <h6>Contraseña:</h6>
                    {/* Con el evento onChange llamamos a la constante getStrength cada vez que se realiza un cambio en el contenido del input */}
                    <input 
                        name="password" 
                        spellCheck="false"
                        type="password" 
                        placeholder="Contraseña"
                        onChange={inputChange}/>
                    <div className={`incorrectLogin ${incorrect? 'activeincorrectLogin': ''}`}>Usuario o contraseña incorrecto</div>
                    <input 
                        type="button" 
                        value="Iniciar sesión" 
                        onClick={onSubmit}/>
                </form>
                <p className='LRegister'>¿Aún no tienes cuenta? <Link to={"/register"}>Registrate</Link></p>
            </div>
        </div>
    )
}

export default Signup