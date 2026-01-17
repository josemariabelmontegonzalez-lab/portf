/*asignar eventos a los campos */
const campoid = Array.from(document.getElementsByClassName("formul"));
campoid.forEach(id => {
    const elemento = id;
    elemento.addEventListener("blur", validar10campos);
});

/* asignar evento a los radio buttons */
document.getElementById("nivel_otro_detalle").addEventListener("input", validarRadioButtonsYTextarea);
const array_opc_form = document.getElementsByClassName("opciones_form");
for (let i = 0; i < array_opc_form.length; i++) array_opc_form[i].addEventListener('click', mostrar_ocultar_texarea);
for (let i = 0; i < array_opc_form.length; i++) array_opc_form[i].addEventListener('click', validarRadioButtonsYTextarea);

/*asignar evento fecha y documento */
document.getElementById("fecha_nacimiento").addEventListener("blur", validarFechaNacimiento);
document.getElementById("numero_documento").addEventListener("blur", validarDocumento);

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("miFormulario");
    formulario.addEventListener("submit", function (event) {

        const intento_cambio_error1 = document.getElementsByClassName("error1");
        const intento_cambio_formul = document.getElementsByClassName("formul");

        /* comprobacion de si ha habido modificacion, si hay que se recargue la pagina */
        if (intento_cambio_error1.length !== 10 || intento_cambio_formul.length !== 10) {
            event.preventDefault();
            location.reload();
        }

        /* validacion boton enviar todas las funciones tienen que devolver true */
        const esValido = [
            validar10campos(),
            validarFechaNacimiento(),
            validarDocumento(),
            validarRadioButtonsYTextarea(),
            validar_aceptar_terminos()
        ].every(Boolean);

        if (!esValido) {
            event.preventDefault(); /* Detener envío si alguna validación falla */
            mostrarModal("Por favor, corrige los errores antes de enviar el formulario.");
        }
        /*else {
            mostrarModal("Formulario enviado correctamente.");
        }*/
    });
});

/* (evento = null) es para que si no se le pasa un valor a la funcion no sea undefined si no null */
function validar10campos(evento = null) {

    /* array_regex para validar los campos */
    const array_regex = {
        curso_prioridad_1: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
        curso_prioridad_2: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,50}$/,
        nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/,
        apellidos: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,72}$/,
        domicilio: /^[0-9a-zA-ZáéíóúÁÉÍÓ,ÚñÑ\s]{1,72}$/,
        localidad: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
        provincia: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
        codigo_postal: /^\d{5}$/,
        telefono: /^\d{9,15}$/,
        correo_electronico: /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){0,63}@[a-zA-Z0-9-](\.?[a-zA-Z0-9_-]){1,63}\.[a-zA-Z]{2,24}$/
    };

    /* el map(el => el.id) recorre y extrae el id de cada elemento */
    const campo = Array.from(document.getElementsByClassName("formul")).map(el => el.id);
    const pase = Array.from(document.getElementsByClassName("error1"));

    /* Función para validar un solo campo */
    const validarCampo = (valor, error, id) => {
        const regex = array_regex[id];
        if (!regex.test(valor)) {
            /* usamos el replace para quitar las _ por espacios */
            error.textContent = error.textContent = id.replace(/_/g, " ") + ' contiene un valor no válido';
            return false;
        }
        error.textContent = "";
        return true;
    };
    /* evento?.type es una forma de acceder de manera segura a una propiedad de un objeto */
    if (evento && evento.type === "blur") {
        /* usamos el event.target.id para que acceda al id del que activo el evento y lo usamos para encontrarlo en el campo */
        const index = campo.indexOf(evento.target.id);
        return index !== -1 && validarCampo(evento.target.value.trim(), pase[index], campo[index]);
    } else {
        /* validacion para el boton de envio*/
        let semaforo = true;
        /* id es el valor y i el la posicion */
        campo.forEach((id, i) => {
            const recoger = document.getElementById(id).value.trim();
            const esCampoValido = validarCampo(recoger, pase[i], id);
            if (!esCampoValido) semaforo = false; /* si un campo es falso, que sea falso */
        });
        return semaforo; /*Devuelve true si todos los campos son válidos*/
    }
}

/*Validar fecha de nacimiento*/
function validarFechaNacimiento() {
    const fecha = document.getElementById("fecha_nacimiento").value;
    const errorDiv = document.getElementById("errorFechaNacimiento");

    /*Verificar si el campo está vacío*/
    if (!fecha) {
        errorDiv.textContent = "Por favor, ingresa tu fecha de nacimiento.";
        return false;
    }

    /* Descomponer la fecha ingresada*/
    const [ano, mes, dia] = fecha.split("-").map(Number);
    const hoy = new Date();
    const fechaNacimiento = new Date(ano, mes - 1, dia);

    const edadMinima = 16; /*Edad mínima permitida*/
    const edadMaxima = 120; /* Edad máxima permitida*/
    const hace120Anios = new Date(); /* Fecha de hace 120 años*/
    hace120Anios.setFullYear(hoy.getFullYear() - edadMaxima);

    /*Validar si la fecha es válida*/
    if (isNaN(fechaNacimiento.getTime())) {
        errorDiv.textContent = "La fecha ingresada no es válida.";
        return false;
    }

    /* Verificar si la fecha es mayor a hoy o menor que hace 120 años*/
    if (fechaNacimiento > hoy) {
        errorDiv.textContent = "La fecha de nacimiento no puede ser futura.";
        return false;
    } else if (fechaNacimiento < hace120Anios) {
        errorDiv.textContent = "La fecha de nacimiento no puede ser anterior a hace 120 años.";
        return false;
    }

    /* Calcular la edad mínima requerida (16 años)*/
    const fechaLimite = new Date(fechaNacimiento);
    fechaLimite.setFullYear(fechaLimite.getFullYear() + edadMinima);

    if (hoy < fechaLimite) {
        errorDiv.textContent = "Debes tener al menos 16 años.";
        return false;
    }

    /*Limpiar el mensaje de error si todo es válido*/
    errorDiv.textContent = ""
    return true;
}

/*Validar documento*/
function validarDocumento() {
    const tipoElemento = document.querySelector('input[name="tipo_documento"]:checked');

    if (!tipoElemento) {
        const errorDocumento = document.getElementById("errorDocumento");
        errorDocumento.textContent = "Selecciona un tipo de documento.";
        return false;
    }

    const tipo = tipoElemento.value;
    const numero = document.getElementById("numero_documento").value.trim();
    let esValido = false;

    if (tipo === "DNI_NIF") {
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const numeroParte = numero.substring(0, numero.length - 1);
        const letra = numero.substring(numero.length - 1).toUpperCase();
        if (/^\d{8}[A-Za-z]$/.test(numero)) {
            esValido = letras.charAt(parseInt(numeroParte) % 23) === letra;
        }
    } else if (tipo === "NIE") {
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const niePrefix = { X: '0', Y: '1', Z: '2' };
        const numeroParte = niePrefix[numero.charAt(0).toUpperCase()] + numero.substring(1, numero.length - 1);
        const letra = numero.substring(numero.length - 1).toUpperCase();
        if (/^[XYZxyz]\d{7}[A-Za-z]$/.test(numero)) {
            esValido = letras.charAt(parseInt(numeroParte) % 23) === letra;
        }
    }

    if (!esValido) {
        errorDocumento.textContent = "El número de documento es incorrecto.";
        return false;
    }
    errorDocumento.textContent = "";
    return true;
}

function validarRadioButtonsYTextarea() {
    const radios = document.getElementsByName("nivel"); /*Obtenemos todos los radio buttons con name="nivel"*/
    const textarea = document.getElementById("nivel_otro_detalle");
    const errorDiv = document.getElementById("errorNivelOtroDetalle");
    let seleccionado = false;

    /*Verificar si algún radio button está seleccionado*/
    for (const radio of radios) {
        if (radio.checked) {
            seleccionado = true;
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,255}$/;

            /*Si el seleccionado es "Otro", validar el contenido del textarea*/
            if (radio.value === "Otro") {
                if (!regex.test(textarea.value.trim())) {
                    errorDiv.textContent = "Por favor, especifica tus estudios si seleccionas 'Otro'.";
                    return false; /*Si está vacío, marcar como error*/
                } else {
                    errorDiv.textContent = ""; /*liminar errores si está todo correcto*/
                    return true;
                }
            }
        }
    }

    /*si no hay ningún radio seleccionado, mostrar un error general*/
    if (!seleccionado) {
        errorDiv.textContent = "Por favor, selecciona un nivel de estudios.";
        return false;
    }

    /*Si seleccionó algo distinto de "Otro", limpiar errores y continuar*/
    errorDiv.textContent = "";
    return true;
}

/* ocultar el textarea*/
function mostrar_ocultar_texarea() {
    const textarea = document.getElementById("nivel_otro_detalle");
    const nivelOtro = document.getElementById("nivel_otro");
    if (nivelOtro.checked) {
        textarea.style.display = "block";
    } else {
        textarea.style.display = "none";
        textarea.value = ""; /* Limpia el contenido siempre*/
    }
    return true;
}

function validar_aceptar_terminos() {
    const aceptar_terminos = document.querySelector('input[name="aceptar_terminos"]');

    if (!aceptar_terminos.checked) {
        document.getElementById("errorAceptar_terminos").textContent = "Tiene que aceptar los terminos y condiciones";
        return false;
    }

    document.getElementById("errorAceptar_terminos").textContent = "";
    return true;
}

