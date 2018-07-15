var faker = require("faker");

var appRouter = function (app, functionsDB, jwt) {

  app.get("/getTypeUsers", function (req, res) {
    functionsDB.getTypeUsers(req, res);
  });

  app.get("/getTypeDocuments", function (req, res) {
    functionsDB.getTypeDocuments(req, res);
  });

  app.get("/getDistrict", function (req, res) {
    functionsDB.getDistrict(req, res);
  });

  app.get("/getFlaws", function (req, res) {
    functionsDB.getFlaws(req, res);
  });

  app.get("/getBrands", function (req, res) {
    functionsDB.getBrands(req, res);
  });

  app.post('/registerUser', function (req, res) {
    functionsDB.registerUser(req, res, jwt, app);
  });

  app.post("/autenticate", function (req, res) {
    functionsDB.autenticate(req, res, jwt, app);
    return;
    // var registro = {};
    // registro.name = 'KIA';
    // registro.description = 'ESTO ES UNA PRUEBA';

    // req.models.brands.createAsync(registro)
    //   .then(function (results) {
    //     console.log(results);
    //   });
    // req.models.brands.findAsync({ 'name': 'kia' })
    //   .then(function (results) {
    //     console.log('resultado:');
    //     console.log(results.length);
    //     console.log(results);
    //     console.log(JSON.stringify(results));

    //     results[0].name = 'ESTA ES UNA NUEVA MARCA';
    //     results[0].saveAsync()
    //       .then(function () {
    //         console.log('se grabó');
    //       });
    //   });


    // registro.save(function (err) {
    //   if (err) {
    //     console.log('se produjo un error al guardar: ', err);
    //     return;
    //   }
    //   console.log('se registró');
    // });
    // req.models.brands.create({
    //   name: 'TOYOTA',
    //   description: 'ESTO ES UNA DESCRIPCION'
    // }, function (err) {
    //   if (err) {
    //     console.log('se produjo un error al guardar: ', err);
    //     return;
    //   }
    //   req.models.brands.find({ name: 'TOYOTA' }, function (err, marca) {
    //     if (err) {
    //       console.log('se produjo un error al recuperar registro');
    //       return;
    //     }
    //     console.log(marca.length);
    //     console.log(JSON.stringify(marca));
    //   })
    // });



    var user = req.body.user;
    var password = req.body.clave;



    /*aqui nos contectaremos al mysql */
    if (user == 'ADMIN' && password == 'ADMIN') {
      const payload = {
        admin: user
      };
      var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: '1h' // expira en 1 h
      });

      res.status(200).send({
        message: 'Bienvenido XXXXXX',
        token: token
      });
    } else
      res.status(400).send({ message: 'Usuario o Contraseña incorrectos' });
  });

  /*REST CON TOKEN*/

  app.post("/api/editCustomer", function (req, res) {
    functionsDB.editCustomer(req, res, jwt, app);
  });
  app.post("/api/editProvider", function (req, res) {
    functionsDB.editProvider(req, res, jwt, app);
  });
  app.post("/api/insertRequests", function (req, res) {
    functionsDB.insertRequests(req, res, jwt, app);
  });

  app.get("/api/getEmergencyFree", function (req, res) {
    functionsDB.getEmergencyFree(req, res, jwt, app);
  });

  app.post('/api/getEmergencyFreeHistorial', function (req, res) {
    functionsDB.getEmergencyFreeHistorial(req, res, jwt, app);
  });

  app.post('/api/insertEmergencyFreeHistorial', function (req, res) {
    functionsDB.insertEmergencyFreeHistorial(req, res, jwt, app);
  });
  app.post('/api/getEmergencyProviders', function (req, res) {
    functionsDB.getEmergencyProviders(req, res, jwt, app);
  });
  app.post('/api/setEmergencyToProviders', function (req, res) {
    functionsDB.setEmergencyToProviders(req, res, jwt, app);
  });

  app.post('/api/setEmergencyFinishs', function (req, res) {
    functionsDB.setEmergencyFinishs(req, res, jwt, app);
  });

  /* TAREA 6 */
  app.post('/api/insertAlumns', function (req, res) {
    functionsDB.insertAlumns(req, res, jwt, app);
  });
  app.post('/api/insertClients', function (req, res) {
    functionsDB.insertClients(req, res, jwt, app);
  });
  app.post('/api/insertTeachers', function (req, res) {
    functionsDB.insertTeachers(req, res, jwt, app);
  });
  app.post('/api/insertProducts', function (req, res) {
    functionsDB.insertProducts(req, res, jwt, app);
  });
  app.post('/api/insertProviders', function (req, res) {
    functionsDB.insertProviders(req, res, jwt, app);
  });
  app.post('/api/getEmergencyHistories', function (req, res) {
    functionsDB.getEmergencyHistories(req, res, jwt, app);
  });
  app.post('/api/getProviders', function (req, res) {
    functionsDB.getProviders(req, res, jwt, app);
  });
  

  // app.get("/user", function (req, res) {
  //   var data = ({
  //     firstName: faker.name.firstName(),
  //     lastName: faker.name.lastName(),
  //     username: faker.internet.userName(),
  //     email: faker.internet.email()
  //   });
  //   res.status(200).send(data);
  // });

  app.get("/users/:num", function (req, res) {

    mysql.getPersons(res);

    return;
    var users = [];
    var num = req.params.num;

    if (isFinite(num) && num > 0) {
      for (i = 0; i <= num - 1; i++) {
        users.push({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          email: faker.internet.email()
        });
      }

      res.status(200).send(users);

    } else {
      res.status(400).send({ message: 'invalid number supplied' });
    }

  });
}

module.exports = appRouter;