//Load express module with `require` directive
var express = require('express')
var app = express()
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Usuarios API",
            description: "Usuario API",
            contact: {
                name: "jhndagon"
            },
            servers: ["http://localhost:8081"]
        }
    },
    basePath: "/",
    apis: ["./index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(express.json())
app.use(express.urlencoded({extended: false}))



/**
 * @swagger
 * definitions:
 *   Usuario:
 *     type: object
 *     required: 
 *       - nombre
 *       - correo
 *     properties:
 *       nombre:
 *         type: string
 *       apellido:
 *         type: string
 *       correo:
 *         type: string
 *       telefono:
 *         type: string
 */

/**
 * @swagger
 * /api/usuarios:
 *  get:
 *    description: Get all usuarios
 *    produces: 
 *      - application/json
 *    responses:
 *      '200':
 *        description: A succesfull response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 */
app.get('/api/usuarios', async function (req, res) {
    let usuarios = await Usuario.find();
    return res.status(200).json(usuarios);
});


/**
 * @swagger
 * /api/usuarios/{id}:
 *  get:
 *    description: Get all usuarios
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    produces: 
 *      - application/json
 *    responses:
 *      '200':
 *        description: A succesfull response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *      '400':
 *        description: Not existing id
 *      '500':
 *        description: Error in server
 *        content:
 *          type: object
 */
app.get('/api/usuarios/:id', async function (req, res, next) {
    let usuarioId = req.params.id;
    if(!usuarioId){
        return res.status(404).json({
            message: "Usuario id not found."
        });
    }
    try {
        let usuario = await Usuario.findById(usuarioId);
        return res.status(200).json(usuario);
    }
    catch (err){
        next({
            message: `Error when trying to get usuario`
        })
    }
})


/**
 * @swagger
 * /api/usuarios/{id}:
 *  put:
 *    description: Update a usuario by id
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *      - name: usuario
 *        in: body
 *        type: object
 *        schema:
 *          $ref: '#/definitions/Usuario'
 *    produces: 
 *      - application/json
 *    responses:
 *      '201':
 *        description: A usuario is updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Usuario'
 *      '500':
 *        description: Error in server
 *        content:
 *          type: object
 */
app.put('/api/usuarios/:id', async function (req, res, next) {
    let usuarioId = req.params.id;
    try{

        let usuario_ = req.body;
        let usuario = await Usuario.findByIdAndUpdate(usuarioId, usuario_, { new: true});
        return res.status(201).json(usuario);
    }
    catch (err) {
        next({
            message: `Error when trying to update user id ${usuarioId}`
        })
    }
})


/**
 * @swagger
 * /api/usuarios/{id}:
 *  delete:
 *    description: Delete a usuario by id
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    produces: 
 *      - application/json
 *    responses:
 *      '200':
 *        description: A succesfull response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Usuario'
 *      '500':
 *        description: Error in server
 *        content:
 *          type: object
 */
app.delete('/api/usuarios/:id', async function (req, res, next) {
    let usuarioId = req.params.id;
    try{
        let usuario = await Usuario.findByIdAndRemove(usuarioId);
        return res.status(200).json(usuario);
    }
    catch (err) {
        next({
            message: `Error when trying to remove user id: ${usuarioId}.`
        })
    }
})

/**
 * @swagger
 * /api/usuarios/:
 *  post:
 *    description: Create a usuario
 *    produces: 
 *      - application/json
 *    parameters:
 *      - name: usuario
 *        description: Usuario object
 *        in: body
 *        type: object
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Usuario'
 *    responses:
 *      '201':
 *        description: A succesfull response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Usuario'
 *      '500':
 *        description: Error in server
 *        content:
 *          type: object
 */
app.post('/api/usuarios', async function (req, res, next) {
    try{
        let usuario = req.body;
        let usuario_ = new Usuario(usuario);
        await usuario_.save();
        return res.status(201).json(usuario_);
    }
    catch(err) {
        next({
            message: `Error when trying to insert in bd.`
        })
    }
});

app.use((err, req, res, next) => {
    if(err){
        res.status(500).json({
            message: err.message
        })
    }
})


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(8081, function () {
    console.log('app listening on port 8081!')
    mongoose.connect("mongodb://mongo/usuarios",{ useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Mongo connected");
    });
})