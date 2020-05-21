const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    correo: String,
    telefono: String
});

module.exports = mongoose.model("Usuario", usuarioSchema)