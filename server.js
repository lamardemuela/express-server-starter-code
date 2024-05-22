require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

// conexión a la DB
const mongoose = require("mongoose");
//                            Home  puertoDB nombreDB
//                              |      |         |
mongoose
  .connect("mongodb://127.0.0.1:27017/artists-db") // esto es una llamada asíncrona
  .then(() => {
    console.log("conectados a la DDBB, yay!");
  })
  .catch(() => {
    console.log("todo mal, hubo un problema al conectar a la DDBB");
  });

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(
  cors({
    origin: "*",
  })
);

// below two configurations will help express routes at correctly receiving data.
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

// importamos nuestro modelo
const Artist = require("./models/Artist.model");

//****   ROUTES   ****
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" });
});

// ruta para crear artistas en la DB
app.post("/artist", (req, res, next) => {
  console.log(req.body); // aquí podemos ver la información que está enviando el cliente
  Artist.create({
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring: req.body.isTouring,
    genre: req.body.genre,
  })
    .then(() => {
      console.log("artista creado");
      res.json({ message: "Todo bien, artista creado" });
    })
    .catch((error) => {
      console.log(error);
      res.json("hubo un error"); // lo gestionaremos mejor cuando aprendamos gestión de errores
    });
});

// ruta para buscar artistas en la DB
app.get("/artist", async (req, res, next) => {
  try {
    const response = await Artist.find(); // si lo dejamos vacío busca todos los documentos de esta colección
    console.log(response); // visualizamos en consola el array de todos los artistas
    res.json(response); // devolvemos al cliente el array de todos los artistas
  } catch (error) {
    console.log(error);
  }
});

// ruta para buscar artistas. la ponemos antes de los params porque después de la llamada que tiene params dinámicos, las rutas que sean artist/loquesea, iterprepará que "loquesea" es un id
app.get("/artist/search", async (req, res) => {
  console.log("usuario accediedo a ruta search");
  console.log(req.query);
  try {
    // hacemos una búsqueda específica con querying: .find(cualquier query).Las queries vendrán desde el cliente y las recogemos en req.query
    const response = await Artist.find(req.query).select({ name: 1, genre: 1 }); // equivale a la opción "Project" de Mongo Compass
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json("todo mal buscando");
  }
});

// ruta para buscar detalles de un artista por su id (params dinámicos)
app.get("/artist/:artistId", async (req, res) => {
  console.log("usuario accediendo a la ruta");
  // recibimos el id que me pide el cliente a través de la request: req.params
  console.log(req.params);
  // usamos ese id para buscarlo en la DB:
  try {
    const response = await Artist.findById(req.params.artistId);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json("errorr");
  }
});

// ruta para borrar artista
app.delete("/artist/:artistId", async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.artistId);
    res.json("artista borrado");
  } catch (error) {
    console.log(error);
    res.json("error al borrar un artista");
  }
});

// ruta para editar artista (totalmente)
app.put("/artist/:artistId", async (req, res) => {
  try {
    await Artist.findByIdAndUpdate(req.params.artistId, {
      name: req.body.name,
      awardsWon: req.body.awardsWon,
      isTouring: req.body.isTouring,
      genre: req.body.genre,
    });
    res.json("artista editado correctamente")
  } catch (error) {
    console.log(error);
    res.json("error editando un artista (edición total)");
  }
});

// ruta para editar artista (parcialmente)
app.patch("/artist/:artistId/add-genre/:genre", async (req, res) => {
  try {
    await Artist.findByIdAndUpdate(req.params.artistId, {
      $addToSet: { genre: req.params.genre }
    })
    res.json("artista editado correctamente de forma parcial")
  } catch (error) {
    console.log(error);
    res.json("error editando parcialmente")
  }
})


//****   SERVER LISTEN & PORT   ****
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
