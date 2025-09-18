const { formServices } = require("./formServices.js");

// ---------- PRUEBAS TEMPORALES -------- \\

// --> USUARIOS
/*
formServices.getUsuarioAlta((err, result) => {
  if (err) {
    console.error(`Error al obtener los usuarios - ${err}`);
  }
  console.log(result);
});
*/

// --> CONTACTOS

/*
formServices.getContactos(1, (err, result) => {
  if (err) {
    console.error(`Error al obtener los contactos - ${err}`);
  }
  console.log(result);
});
*/

// --> TIPO OBRA

/*
formServices.getTiposObra((err, result) => {
  if (err) {
    console.error(`Error al obtener los contactos - ${err}`);
  }
  console.log(result);
});
*/

// --> TIPO FACTURABLE

/*
formServices.getTipoFacturable((err, result) => {
  if (err) {
    console.error(`Error al obtener los contactos - ${err}`);
  }
  console.log(result);
});
*/

// --> ESTADO OBRA

/*
formServices.getEstadosObra((err, result) => {
  if (err) {
    console.error(`Error al obtener los contactos - ${err}`);
  }
  console.log(result);
});
*/

// --> EMPRESAS
/*
formServices.getEmpresas((err, result) => {
  if (err) {
    console.error(`Error al obtener los contactos - ${err}`);
  }
  console.log(result);
});
*/

// --> COMPLEJOS

formServices.getComplejos((err, result) => {
  if (err) {
    console.error(`Error al obtener los complejos - ${err}`);
  }
  console.log(result);
});

// _______________________________________ \\
