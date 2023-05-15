let url = "http://localhost";
let btLoguear = document.querySelector("#bt_loguear");
let username_form = document.querySelector("#txt_user");
let pass_form = document.querySelector("#txt_pass");
let btn_mostrar = document.querySelector("#bt_mostrar");

let genero_query = document.querySelector("#genero_query");
let category_query = document.querySelector("#category_query");
let buscar_ = document.querySelector("#txt_buscar");

category_query.addEventListener("change", buscarcontent);
genero_query.addEventListener("change", buscarcontent);

buscar_.addEventListener("keyup", function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        buscarcontent();
    }
});

let btn_ingresar = document.querySelector("#bt_ingresar");
let btn_create_usr = document.querySelector("#create_usr");
let btModificarcontent = document.querySelector("#bt_modificar_content");
let divDatos = document.querySelector("#datos");

btn_create_usr.addEventListener("click",create_user);
btn_mostrar.addEventListener("click", mostrarDatos);


btn_ingresar.addEventListener("click", save);
btLoguear.addEventListener("click", ingresarApp);

let title_ = document.querySelector("#title");
let year_ = document.querySelector("#year");
let category_ = document.querySelector('[name="category"]');
let status_ = document.querySelector("#status");
let genero_ = document.querySelector("#genero");
let description_ = document.querySelector("#description");


let content;
let contentModificar;
let idModificar;


function create_user() 
{
    fetch(`${url}/create`, {
        method: "POST", headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            user: document.querySelector("#username").value,
            pass: document.querySelector("#password").value
        })})
    .then(respuesta => respuesta.json())
    .then(datos => { console.log(datos); })
    .finally(()=>{document.querySelector("#username").value = "";
    document.querySelector("#password").value = "";})
    
}


function mostrarDatos() {
    fetch(`${url}/content`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            content = datos
            mostrarcontent(datos)
        })
}

function buscarcontent()
{
    fetch(`${url}/content/query`, {
        method: "POST", headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            title: buscar_.value,
            genero: genero_query.value,
            category : category_query.value,
        })})
    .then(respuesta => respuesta.json())
    .then(datos => {
        //content.push(datos)
        mostrarcontent(datos);
    })
}


function checkCategory(category)
{
    if(category==="PELICULA") {
        document.querySelector("#category_0").click();
    }
    if(category==="SERIE")
    {
        document.querySelector("#category_1").click();
    }
}

function getCategory()
{
    var radios = document.getElementsByName('category');
    for (var radio of radios)
    {
        if (radio.checked) {
            return radio.value;
        }
    }
    return "";
}

function save() 
{
    fetch(`${url}/content`, {
            method: "POST", headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title: title_.value,
                year: parseInt(year_.value),
                genero : genero_.value,
                category: getCategory(),
                status: status_.value,
                description:description_.value,
                id_Usuario: localStorage.getItem("idUsuario")
            })})
        .then(respuesta => respuesta.json())
        .then(datos => {
            content.push(datos)
            mostrarcontent(content);
        })
}

function update() 
{
    contentModificar.title = title_.value;
    contentModificar.year = parseInt(year_.value);
    contentModificar.category =  getCategory();
    contentModificar.genero = genero_.value;
    contentModificar.status = status_.value;
    contentModificar.description = description_.value;
    mostrarcontent(content)
    fetch(`${url}/content`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idModificar,
                title: title_.value,
                year: year_.value,
                genero : genero_.value,
                category:  getCategory(),
                status: status_.value,
                description:description_.value,
            })
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos)
        })
}


function editContent() 
{
    console.log(this.getAttribute("data-idModificar"))
    idModificar = this.getAttribute("data-idModificar");
    console.log(content);
    contentModificar = content.find(content => content._id === idModificar)
    console.log(contentModificar);
    title_.value = contentModificar.title;
    year_.value = parseInt(contentModificar.year);
    checkCategory(contentModificar.category);
    genero_.value = contentModificar.genero;
    status_.value = contentModificar.status;
    description_.value = contentModificar.description;

    btModificarcontent.addEventListener("click", update)
}

function eliminarcontent() 
{
    console.log(this.getAttribute("data-idEliminar"))
    let idEliminar = this.getAttribute("data-idEliminar");
    let posicionEliminar = content.findIndex(content => content._id === idEliminar);
    console.log(posicionEliminar);
    content.splice(posicionEliminar, 1)
    mostrarcontent(content)
    fetch(`${url}/content/${idEliminar}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            //mostrarcontent(datos)
        })
}

function ingresarApp() 
{
    let username = username_form.value;
    let password = pass_form.value;
    fetch(`${url}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: username,
                pass: password
            })
        })
        .then(respuesta => respuesta.json())
        .then(datos => 
            {
            console.log(datos)
            if (datos.id_valido === false) 
            {
                alert("usuario no valido")
            } 
            else
            {
                let title = datos.datosUsuario.titleUsuario;
                let id_usuario = datos.datosUsuario.id;
                localStorage.setItem("titleUsuario", title)
                localStorage.setItem("idUsuario", id_usuario)
                //-----------------------------------------
                /* alert(`Hola ${localStorage.getItem("titleUsuario")}`) */
                document.querySelector("#info").style.display = "block"
                document.querySelector("#login").style.display = "none"
                content = datos.content;
                mostrarcontent(content)
            }
        })
}

function mostrarcontent(_content) 
{
    console.log(_content);
    content = _content
    divDatos.innerHTML = "";
    _content.forEach(element => 
    {
        divDatos.innerHTML += `<article class="col-md-12 mt-4 alert alert-secondary mx-1 mensajes content_">
            <h6 data-id="${element._id}"> <b><h4> ${element.title}</h4></b> ${element.genero} <code>${element.year}</code> ${element.category}</h6>
            <p> ${element.description}</p>
            <input data-idModificar="${element._id}" type="button" class="modificar form-select-sm float-end btn" value="Modificar">
            <input data-idEliminar="${element._id}" type="button" class="eliminar form-select-sm float-end btn" value="Eliminar">
            </article>`
    });

    let bts_modificar = document.querySelectorAll(".modificar");
    bts_modificar.forEach(element => {
        element.addEventListener("click", editContent)
    });
    
    let bts_eliminar = document.querySelectorAll(".eliminar");
    bts_eliminar.forEach(element => {
        element.addEventListener("click", eliminarcontent)
    });
}

let btCerrar = document.querySelector("#bt_cerrar");
btCerrar.addEventListener("click", function () {
    localStorage.clear();
    document.querySelector("#info").style.display = "none"
    document.querySelector("#login").style.display = "block";
    content = [];
    fetch(`${url}/cerrar`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos)
        })

});


if (localStorage.idUsuario)
{
    console.log("ya definido usuario");
    console.log(localStorage.titleUsuario);
    document.querySelector("#info").style.display = "block"
    document.querySelector("#login").style.display = "none";
}

mostrarDatos()