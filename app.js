var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var functionsDB = require("./database/functionsDB.js");
var orm = require("orm");//ORM PARA MYSQL

var jwt = require('jsonwebtoken'); //usado para crear, firmar y verificar tokens
var config = require('./config'); // get our config file

var app = express();
var port = process.env.PORT || 3000;

var opts = {
  host: 'localhost',
  database: 'dbmechanical',
  protocol: 'mysql',
  port: '3306',
  password: 'cajami4423',
  query: { pool: true }
};

// orm.connectAsync(opts)
//   .then(function(db) {
//       // connected
//       // ...

//     console.log('conectado...');
//   })
//   .catch(function(err) {
//      console.error('Connection error: ' + err);
//   });

app.set('superSecret', config.secret); // secret variable

app.use(orm.express(opts, {
  define: function (db, models, next) {
    models.brands = db.define("brands", {
      idbrand: { type: 'serial', key: true },
      name: String,
      description: String
    });
    models.users = db.define("users", {
      iduser: { type: 'serial', key: true },
      name: String,
      password: String,
      idtypeuser: Number
    });
    models.typeusers = db.define("typeusers", {
      idtypeuser: { type: 'serial', key: true },
      name: String,
      description: String
    });

    models.customers = db.define("customers", {
      idcustomer: { type: 'serial', key: true },
      itypedocument: Number,
      nrodocument: String,
      name: String,
      address: String,
      iddistrict: Number,
      phone: String,
      email: String,
      iduser: Number
    });

    models.providers = db.define("providers", {
      idprovider: { type: 'serial', key: true },
      itypedocument: Number,
      nrodocument: String,
      name: String,
      address: String,
      iddistrict: Number,
      contact: String,
      phone: String,
      email: String,
      web: String,
      longitude: Number,
      latitude: Number,
      score: Number,
      schedule: String,
      iduser: Number
    });

    models.cars = db.define("cars", {
      idcar: { type: 'serial', key: true },
      idbrand: Number,
      modelo: String,
      year: Number,
      idcustomer: Number
    });
    models.categories = db.define("categories", {
      idcategory: { type: 'serial', key: true },
      name: String,
      description: String
    });
    models.districts = db.define("districts", {
      iddistrict: { type: 'serial', key: true },
      name: String
    });
    models.typedocuments = db.define("typedocuments", {
      idtypedocument: { type: 'serial', key: true },
      description: String
    });

    models.flaws = db.define("flaws", {
      idflaw: { type: 'serial', key: true },
      description: String
    });

    models.requests = db.define("requests", {
      idrequest: { type: 'serial', key: true },
      date: String,
      idcar: Number,
      idstate: String,
      details: String,
      idflaw: Number,
      district: String,
      address: String,
      latitude: Number,
      longitude: Number,
      observation: String,
      score: Number,
      datefinished: String
    });

    models.requesthistory = db.define("requesthistory", {
      idrequesthistory: { type: 'serial', key: true },
      idrequest: Number,
      date: String,
      idstate: String,
      idprovider: Number,
      latitude: Number,
      longitude: Number
    });


    models.favorites = db.define("favorites", {
      idfavorite: { type: 'serial', key: true },
      idprovider: Number,
      date: String,
      idcustomer: Number,
      idstate:String
    });


    /*TAREA 6*/
    models.tarea6_alumnos = db.define("tarea6_alumnos", {
      iCodAlumno: { type: 'serial', key: true },
      vNombres: String,
      vApellidos: String,
      vDireccion: String
    });

    models.tarea6_clientes = db.define("tarea6_clientes", {
      iCodCliente: { type: 'serial', key: true },
      vNombre: String,
      vCelular: String,
      vDni: String
    });

    models.tarea6_docentes = db.define("tarea6_docentes", {
      iCodDocente: { type: 'serial', key: true },
      vNombres: String,
      vApellidos: String,
      vEmail: String
    });

    models.tarea6_productos = db.define("tarea6_productos", {
      iCodProducto: { type: 'serial', key: true },
      vDescripcion: String,
      iCantidad: Number,
      vMarca: String
    });


    models.tarea6_proveedores = db.define("tarea6_proveedores", {
      iCodProveedor: { type: 'serial', key: true },
      vRazonSocial: String,
      vRUC: String,
      vTelefono: String
    });

    next();
  }
}));




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// obtener una instancia del enrutador para las rutas de API
var apiRoutes = express.Router();

// route middleware para verificar un token
apiRoutes.use(function (req, res, next) {

  // verifica los parámetros de encabezado o URL o publica los parámetros para token
  var token = req.body.token || req.query.token || req.headers['token'];

  // decode token
  if (token) {

    // verifica secreto y verifica exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.status(400).send({ success: false, message: 'Error al autenticar el token' });
      } else {
        // si todo está bien, guardar para solicitar su uso en otras rutas
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token proporcionado.'
    });
  }
});

//app.use('/api', apiRoutes);

routes(app, functionsDB, jwt);

var server = app.listen(port, function () {
  console.log("app running on port.", server.address().port);
});


//module.exports = appRouter;