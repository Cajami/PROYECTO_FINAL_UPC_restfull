var mysql = require('mysql');
var connection = mysql.createConnection({
  // host     : 'localhost',
  // user     : 'cajamisoft',
  // password : '',
  // database : 'mydb'
  host: 'localhost',
  user: 'root',
  password: 'cajami23',
  database: 'mydb'
});

module.exports = {

  getPersons: function (res) {
    //res.status(200).send('esto enviado dessde scriptsdb.js');
    //connection.connect();

    connection.query('SELECT * FROM users', function (error, results, fields) {
      if (error)
        res.status(400).send({ message: 'invalid number supplied' });
      else {
        if (!results[0].hasOwnProperty('iduser'))
          res.status(400).send({ message: results[0] });
        else {
          var respuesta = {};
          for (var i = 0; i < results.length; i++)
            respuesta['Table' + (i + 1)] = results[i];
          console.log(respuesta);
          res.status(200).send(respuesta);
        }
      }
    });
    //connection.end();
  },
  insertUsuario: function (req, res) {
    var arrayParameter = [];
    arrayParameter.push(req.body.iTipoUsuario);
    arrayParameter.push(req.body.iTipoDocumento);
    arrayParameter.push(req.body.vNroDocumento);
    arrayParameter.push(req.body.vUsuario);
    arrayParameter.push(req.body.vClave);

    console.log(arrayParameter);

    connection.query('call `SP_InsertarUsuario`(?,?,?,?,?);', arrayParameter, function (error, results, fields) {
      if (error)
        res.status(400).send({ message: 'invalid number supplied' });
      else {
        try {
          if (!results[0][0].hasOwnProperty('iduser')) {
            res.status(200).send(results[0]);
          } else {
            var respuesta = {};
            for (var i = 0; i < results.length; i++) {
              respuesta['Table' + (i + 1)] = results[i];
            }

            console.log(respuesta);
            res.status(200).send(respuesta);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });


  }

}