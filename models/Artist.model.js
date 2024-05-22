const mongoose = require("mongoose")
// const Schema = mongoose.Schema => podemos crear una variable para no tener que poner mongoose.Schema

//* SCHEMA *
const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // el campo es obligatorio
        unique: true, // no puede haber dos documentos con el mismo name
    },
    awardsWon: {
        type: Number,
        min: 0, // valor mínimo posible
        default: 0 // valor predeterminado en caso de que el cliente no lo entregue
    },
    isTouring: Boolean,
    genre: [{
        type: String,
        enum: ["rock", "alternative", "pop", "metal", "country", "jazz"] // estos son los únicos valores posibles de esta propiedad
    }]
})

//* MODEL:nos permite acceder a esta colección en la DB *
// el método model requiere dos argumentos:
// 1. el nombre interno con el que se conoce el modelo/colección (SIEMPRE EN INGLÉS Y EN SINGULAR)
// 2. el esquema
const Artist = mongoose.model("Artist", artistSchema)

//* Exportamos Model *
module.exports = Artist // usar el modelo en cualquier lugar de servidor