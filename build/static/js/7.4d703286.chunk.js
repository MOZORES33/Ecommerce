(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{57:function(e,t,a){},70:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a(26),c=a(4),o=a(0),i=a.n(o),s=(a(57),a(25)),l=a(46),u=a(2),m=a(24);t.default=function(e){var t=e.setAdmin,a=Object(o.useState)(0),p=Object(c.a)(a,2),d=p[0],g=p[1],b=Object(o.useState)(!1),v=Object(c.a)(b,2),f=v[0],E=v[1],h=Object(o.useState)({username:"",password:""}),j=Object(c.a)(h,2),O=j[0],w=j[1],S=Object(u.o)(),k=function(e){var t=e.target;E(!1);var a=t.name,c=t.value;w(Object(r.a)({},O,Object(n.a)({},a,c)))};return i.a.createElement("div",{className:"signUp"},1===d&&Object(s.a)(g,"Ocurri\xf3 un error inesperado.","Por favor intente nuevamente mas tarde",1,"Aceptar"),i.a.createElement("div",{className:"containerSignUp"},i.a.createElement("div",{className:"img"}),i.a.createElement("h3",null,"Inicio de sesi\xf3n"),i.a.createElement("form",{action:""},i.a.createElement("h6",null,"Usuario:"),i.a.createElement("input",{type:"text",id:"username",name:"username",onChange:k,placeholder:"Usuario"}),i.a.createElement("h6",null,"Contrase\xf1a:"),i.a.createElement("input",{name:"password",spellCheck:"false",type:"password",placeholder:"Contrase\xf1a",onChange:k}),i.a.createElement("div",{className:"incorrectLogin ".concat(f?"activeincorrectLogin":"")},"Usuario o contrase\xf1a incorrecto"),i.a.createElement("input",{type:"button",value:"Iniciar sesi\xf3n",onClick:function(){l.a.post("https://apinodejsproyectofinal-production-918e.up.railway.app/login",O,{timeout:1e4}).then(function(e){var a=e.data;"error"!==a.toString()?"false"!==a.toString()?(localStorage.setItem("token",a.token),"admin"===O.username&&t(!0),S("/")):E(!0):g(1)}).catch(function(){g(1)})}})),i.a.createElement("p",{className:"LRegister"},"\xbfA\xfan no tienes cuenta? ",i.a.createElement(m.b,{to:"/register"},"Registrate"))))}}}]);
//# sourceMappingURL=7.4d703286.chunk.js.map