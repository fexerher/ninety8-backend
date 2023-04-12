const express = require('express')
const cors = require('cors');
const session = require('express-session');
const { db } = require('../db/connection');
const fileUpload = require('express-fileupload');
const sessionSecret = process.env.SESSION_SECRET || 'esta_es_una_cadena_secreta_fuerte';
const MySQLStore = require('express-mysql-session')(session);

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'ninety8'
}

const sessionStore = new MySQLStore(options);

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.productosPath = '/api/productos';
        this.carritoPath = '/api/carrito';
        this.authPath = '/api/auth';
        this.atributoPath = '/api/variacion';
        this.checkoutPath = '/api/checkout';

        // DbConnection
        this.dbConnection();
        // Middlewares
        this.middlewares();
        // Rutas
        this.routes();
    }


    async dbConnection(){
        try {
            await db.authenticate();
            console.log('data online');
        } catch (error) {
            throw new Error(error)
        }
    }

    middlewares(){
        this.app.use(cors({
            credentials: true,
            origin: ['https://ninety8.netlify.app', 'http://localhost:5173'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            
        }));

        // Lectura y parse del body
        this.app.use(express.json());
        
        this.app.use(express.static('public'));
        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
        
        this.app.set("trust proxy", 1);

        this.app.use(session({
            key: 'cookie_usuario',
            store: sessionStore,
            secret: sessionSecret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'none',
                path: '/',
            }
        }));
        
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
        this.app.use(this.productosPath, require('../routes/productos'))
        this.app.use(this.carritoPath, require('../routes/carrito'))
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.atributoPath, require('../routes/atributo'))
        this.app.use(this.checkoutPath, require('../routes/checkout'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }
}

module.exports = Server;
