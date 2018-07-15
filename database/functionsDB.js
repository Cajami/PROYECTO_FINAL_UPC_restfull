module.exports = {

  getTypeDocuments: function (req, res) {
    req.models.typedocuments.findAsync()
      .then(function (registros) {
        res.status(200).send({ response: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },

  getTypeUsers: function (req, res) {
    req.models.typeusers.findAsync()
      .then(function (registros) {
        res.status(200).send({ response: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },

  getDistrict: function (req, res) {
    req.models.districts.findAsync()
      .then(function (registros) {
        res.status(200).send({ response: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },

  getBrands: function (req, res) {
    req.models.brands.findAsync()
      .then(function (registros) {
        res.status(200).send({ response: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },
  getFlaws: function (req, res) {
    req.models.flaws.findAsync()
      .then(function (registros) {
        res.status(200).send({ response: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },
  registerUser: function (req, res, jwt, app) {
    var nroDocumento = req.body.nrodocument;
    var user = req.body.user;
    var password = req.body.clave;
    var idtypeuser = req.body.idtypeuser;
    var idtypedocument = req.body.idtypedocument;

    /*BUSCAMOS QUE NO HAYA OTRO USUARIO IGUAL*/
    req.models.users.findAsync({ 'name': user })
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(200).send({ message: 'Usuario ya existe' });
        } else {
          var newrow = {
            name: user,
            password: password,
            idtypeuser: idtypeuser
          }

          req.models.users.createAsync(newrow)
            .then(function (results) {

              var newregistro = {
                itypedocument: idtypedocument,
                nrodocument: nroDocumento,
                iduser: results.iduser
              }

              const payload = {
                admin: user
              };

              var token = jwt.sign(payload, app.get('superSecret'), {
                expiresIn: '1h' // expira en 1 h
              });

              if (idtypeuser == 1) {//CLIENTE
                req.models.customers.createAsync(newregistro).then(function (resultsuser) {
                  req.models.districts.findAsync()
                    .then(function (registrosDistrito) {
                      res.status(200).send({ user: results, customer: resultsuser, district: registrosDistrito, token: token });
                    });
                });
              } else {
                newregistro.score = 0;
                req.models.providers.createAsync(newregistro).then(function (resultsuser) {
                  req.models.districts.findAsync()
                    .then(function (registrosDistrito) {
                      res.status(200).send({ user: results, provider: resultsuser, district: registrosDistrito, token: token });
                    });
                });
              }
            })
            .catch(function () {
              res.status(400).send({ message: 'Error! al guardar usuario en el servidor' });
            });
        }

      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  autenticate: function (req, res, jwt, app) {
    var user = req.body.user;
    var password = req.body.clave;

    req.models.users.findAsync({ 'name': user, 'password': password })
      .then(function (registros) {
        if (registros.length == 0) {
          res.status(200).send({ message: 'Usuario y/o Clave incorrectos' });
        } else {
          const payload = {
            admin: user
          };
          var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: '1h' // expira en 1 h
          });

          /*BUSCAMOS SI EL USUARIO ES CUSTOMER O PROVIDER*/
          req.models.customers.findAsync({ 'iduser': registros[0].iduser })
            .then(function (row) {
              if (row.length == 0) {
                req.models.providers.findAsync({ 'iduser': registros[0].iduser })
                  .then(function (rowproveedor) {
                    res.status(200).send({
                      user: registros[0],
                      provider: rowproveedor[0],
                      token: token
                    });
                  });
              } else {
                req.models.cars.findAsync({ idcustomer: row[0].idcustomer })
                  .then(function (registroCar) {
                    var icodCar = 0;
                    if (registroCar.length > 0)
                      icodCar = registroCar[0].idcar;

                    /*BUSCAMOS LAS EMERGENCIAS PENDIENTES O EN CURSO*/
                    req.models.requests.findAsync({ idcar: icodCar, idstate: ['P', 'C'] })
                      .then(function (registrosRequests) {
                        /*RECUPERAMOS TODAS LAS FALLAS*/
                        req.models.flaws.findAsync()
                          .then(function (registrosFlaws) {

                            if (registrosRequests.length > 0) {
                              req.models.requesthistory.findAsync({ idrequest: registrosRequests[0].idrequest, idstate: registrosRequests[0].idstate })
                                .then(function (registroDetalle) {

                                  req.models.providers.findAsync({ idprovider: registroDetalle[0].idprovider })
                                    .then(function (registroProveedor) {
                                      registroDetalle[0].nameProveedor = registroProveedor[0].name;
                                      res.status(200).send({
                                        user: registros[0],
                                        customer: row[0],
                                        car: registroCar,
                                        request: registrosRequests,
                                        flaw: registrosFlaws,
                                        requestHistory: registroDetalle[0],
                                        token: token
                                      });
                                    });
                                })
                            } else {
                              res.status(200).send({
                                user: registros[0],
                                customer: row[0],
                                car: registroCar,
                                request: registrosRequests,
                                flaw: registrosFlaws,
                                token: token
                              });
                            }


                          });
                      });
                  });
              }
            });
        }

      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  editCustomer: function (req, res, jwt, app) {
    var idcustomer = req.body.idcustomer;

    req.models.customers.findAsync({ 'idcustomer': idcustomer })
      .then(function (registro) {
        if (registro.length == 0) {
          res.status(200).send({ message: 'Cliente no existe' });
        } else {

          registro[0].itypedocument = req.body.itypedocument;
          registro[0].nrodocument = req.body.nrodocument;
          registro[0].name = req.body.name;
          registro[0].address = req.body.address;
          registro[0].iddistrict = req.body.iddistrict;
          registro[0].phone = req.body.phone;
          registro[0].email = req.body.email;

          /*UPDATE CUSTOMER*/
          registro[0].saveAsync()
            .then(function () {
              var idcar = req.body.idcar;
              req.models.cars.findAsync({ 'idcar': idcar })
                .then(function (registroCar) {
                  if (registroCar.length == 0) {
                    var newrow = {
                      idbrand: req.body.idbrand,
                      modelo: req.body.model,
                      year: req.body.year,
                      idcustomer: req.body.idcustomer
                    }
                    /*insertamos*/
                    req.models.cars.createAsync(newrow)
                      .then(function (resultado) {
                        res.status(200).send({ customer: 'OK', car: resultado });
                      });
                  } else {
                    registroCar[0].idbrand = req.body.idbrand;
                    registroCar[0].model = req.body.model;
                    registroCar[0].year = req.body.year;

                    /*UPDATE CAR*/
                    registroCar[0].saveAsync()
                      .then(function () {
                        res.status(200).send({ customer: 'OK' });
                      });
                  }
                });
            });
        }
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });


  },
  editProvider: function (req, res, jwt, app) {
    var idprovider = req.body.idprovider;

    req.models.providers.findAsync({ 'idprovider': idprovider })
      .then(function (registro) {
        if (registro.length == 0) {
          res.status(200).send({ message: 'Proveedor no existe' });
        } else {

          registro[0].itypedocument = req.body.itypedocument;
          registro[0].nrodocument = req.body.nrodocument;
          registro[0].name = req.body.name;
          registro[0].address = req.body.address;
          registro[0].iddistrict = req.body.iddistrict;
          registro[0].phone = req.body.phone;
          registro[0].email = req.body.email;
          registro[0].contact = req.body.contact;
          registro[0].web = req.body.web;
          registro[0].longitude = req.body.longitude;
          registro[0].latitude = req.body.latitude;

          /*UPDATE PROVIDER*/
          registro[0].saveAsync()
            .then(function () {
              res.status(200).send({ provider: 'OK' });
            });
        }
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });


  },
  insertRequests: function (req, res, jwt, app) {
    var idprovider = req.body.idprovider;
    var request = {
      date: new Date(),
      idcar: req.body.idcar,
      details: req.body.details,
      idflaw: req.body.idflaw,
      idstate: 'P',
      district: req.body.district,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }

    req.models.requests.createAsync(request)
      .then(function (registro) {
        res.status(200).send({ request: registro });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });


  },
  getEmergencyFree: function (req, res, jwt, app) {
    req.models.requests.findAsync({ idstate: 'P' })
      .then(function (registros) {
        req.models.flaws.findAsync()
          .then(function (fallas) {
            var total = registros.length;
            var totalFallas = fallas.length;
            for (var i = 0; i < total; i++) {
              for (var j = 0; j < totalFallas; j++) {
                if (registros[i].idflaw == fallas[j].idflaw) {
                  registros[i].description = fallas[j].description;
                  break;
                }
              }
            }
            res.status(200).send({ request: registros });
          });
      });
  },
  getEmergencyFreeHistorial: function (req, res, jwt, app) {
    var idrequest = req.body.idrequest;
    var idprovider = req.body.idprovider;

    req.models.requesthistory.findAsync({ idrequest: idrequest, idprovider: idprovider })
      .then(function (registros) {
        req.models.flaws.findAsync()
          .then(function (fallas) {
            res.status(200).send({ request: registros });
          });
      });
  },
  insertEmergencyFreeHistorial: function (req, res, jwt, app) {
    var requesthistory = {
      idrequesthistory: req.body.idrequesthistory,
      idrequest: req.body.idrequest,
      date: new Date(),
      idstate: 'P',
      idprovider: req.body.idprovider,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }

    req.models.requesthistory.createAsync(requesthistory)
      .then(function (registro) {
        res.status(200).send({ request: registro });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  getEmergencyProviders: function (req, res, jwt, app) {
    var idrequest = req.body.idrequest;

    req.models.requesthistory.findAsync({ idrequest: idrequest, idstate: 'P' })
      .then(function (registros) {
        if (registros.length > 0) {
          req.models.providers.findAsync()
            .then(function (providers) {
              for (var i = 0; i < registros.length; i++) {
                for (var j = 0; j < providers.length; j++) {
                  if (registros[i].idprovider == providers[j].idprovider) {
                    registros[i].name = providers[j].name;
                    registros[i].score = providers[j].score;
                    break;
                  }
                }
              }
              res.status(200).send({ request: registros });
            });
        } else
          res.status(200).send({ request: registros });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  setEmergencyToProviders: function (req, res, jwt, app) {
    var idrequest = req.body.idrequest;
    var idrequesthistory = req.body.idrequesthistory;

    req.models.requests.findAsync({ idrequest: idrequest })
      .then(function (registroRequest) {
        if (registroRequest.length == 0)
          res.status(200).send({ message: 'Error inesperado' });
        else {
          req.models.requesthistory.findAsync({ idrequesthistory: idrequesthistory })
            .then(function (registroRequestHistory) {
              if (registroRequestHistory.length == 0)
                res.status(200).send({ message: 'Error inesperado' });
              else {
                registroRequest[0].idstate = 'C';//ATENCION EN CURSO;
                registroRequestHistory[0].idstate = 'C';//ATENCION EN CURSO;


                registroRequest[0].saveAsync()
                  .then(function () {
                    registroRequestHistory[0].saveAsync()
                      .then(function () {
                        res.status(200).send({
                          request: registroRequest[0],
                          requesthistory: registroRequestHistory[0]
                        });
                      });
                  })
              }
            });
        }
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  setEmergencyFinishs: function (req, res, jwt, app) {
    var idrequest = req.body.idrequest;
    var idrequesthistory = req.body.idrequesthistory;
    var idprovider = req.body.idprovider;
    var idcar = req.body.idcar;
    var score = req.body.score;
    var observation = req.body.observation;
    var favorite = req.body.favorite;//1 : FAVORITO, 0: NO FAVORITO

    req.models.cars.findAsync()
      .then(function (registroCar) {
        if (registroCar.length == 0)
          res.status(200).send({ message: 'Error inesperado' });
        else {
          var idcustomer = registroCar[0].idcustomer;

          req.models.requests.findAsync({ idrequest: idrequest })
            .then(function (registroRequest) {

              if (registroRequest.length == 0)
                res.status(200).send({ message: 'Error inesperado' });
              else {
                req.models.requesthistory.findAsync({ idrequesthistory: idrequesthistory })
                  .then(function (registroRequestHistory) {

                    if (registroRequestHistory.length == 0)
                      res.status(200).send({ message: 'Error inesperado' });
                    else {
                      registroRequest[0].idstate = 'F';//ATENCION EN CURSO;
                      registroRequest[0].observation = observation;//ATENCION EN CURSO;
                      registroRequest[0].score = score;//ATENCION EN CURSO;
                      registroRequest[0].datefinished = new Date();//ATENCION EN CURSO;

                      registroRequestHistory[0].idstate = 'F';//ATENCION EN CURSO;

                      registroRequest[0].saveAsync()
                        .then(function () {
                          registroRequestHistory[0].saveAsync()
                            .then(function () {

                              registroRequest[0].idcustomer = idcustomer;

                              req.models.providers.findAsync({ idprovider: idprovider })
                                .then(function (registroProveedor) {

                                  registroProveedor[0].score = parseInt(registroProveedor[0].score) + parseInt(score);

                                  registroProveedor[0].saveAsync()
                                    .then(function () {

                                      if (favorite == 0)
                                        res.status(200).send({
                                          request: registroRequest[0],
                                          requesthistory: registroRequestHistory[0]
                                        });
                                      else {
                                        req.models.favorites.findAsync({ idprovider: idprovider, idcustomer: idcustomer })
                                          .then(function (registros) {
                                            if (registros.length == 0) {
                                              var row = {
                                                idprovider: idprovider,
                                                date: new Date(),
                                                idcustomer: idcustomer,
                                                idstate: 'A'
                                              }

                                              req.models.favorites.createAsync(row)
                                                .then(function (registro) {
                                                  res.status(200).send({
                                                    request: registroRequest[0],
                                                    requesthistory: registroRequestHistory[0],
                                                    favorite: registro
                                                  });
                                                })
                                                .catch(function () {
                                                  res.status(400).send({ message: 'Error! con la conexion' });
                                                });
                                            } else {
                                              registros[0].idstate = favorite == 1 ? 'A' : 'I';
                                              registros[0].saveAsync()
                                                .then(function () {
                                                  res.status(200).send({
                                                    request: registroRequest[0],
                                                    requesthistory: registroRequestHistory[0],
                                                    favorite: registros[0]
                                                  });
                                                });
                                            }
                                          });
                                      }
                                    });
                                });
                            });
                        })
                    }
                  });
              }
            })
            .catch(function () {
              res.status(400).send({ message: 'Error! con la conexion' });
            });
        }
      });
  },

  getEmergencyHistories: function (req, res) {
    var idcar = req.body.idcar;

    req.models.requests.findAsync({ idcar: idcar, idstate: 'F' })
      .then(function (registrosRequests) {
        if (registrosRequests.length == 0) {
          res.status(200).send({ message: 'SIN REGISTROS' });
        } else {
          var arraySend = [];
          for (var i = 0; i < registrosRequests.length; i++) {
            arraySend.push({
              idrequest: registrosRequests[i].idrequest,
              idRequestHistory: 0,
              date: registrosRequests[i].date,
              datefinish: registrosRequests[i].datefinished,
              //idcustomer: registrosRequests[i].datefinished,
              idprovider: 0,
              idflaw: registrosRequests[i].idflaw,
              detalleFlaw: '',
              nameProvider: '',
              score: registrosRequests[i].score,
              district: registrosRequests[i].district
            });
          }

          req.models.flaws.findAsync()
            .then(function (registrosFallas) {
              for (var i = 0; i < registrosFallas.length; i++) {
                for (var j = 0; j < arraySend.length; j++) {
                  if (arraySend[j].idflaw == registrosFallas[i].idflaw) {
                    arraySend[j].detalleFlaw = registrosFallas[i].description;
                    break;
                  }
                }
              }
              req.models.requesthistory.findAsync({ idstate: 'F' })
                .then(function (registrosHistorial) {
                  for (var i = 0; i < registrosHistorial.length; i++) {
                    for (var j = 0; j < arraySend.length; j++) {
                      if (arraySend[j].idrequest == registrosHistorial[i].idrequest) {
                        arraySend[j].idrequesthistory = registrosHistorial[i].idrequesthistory;
                        arraySend[j].idprovider = registrosHistorial[i].idprovider;
                        break;
                      }
                    }
                  }
                  req.models.providers.findAsync()
                    .then(function (registrosProveedores) {
                      for (var i = 0; i < registrosProveedores.length; i++) {
                        for (var j = 0; j < arraySend.length; j++) {
                          if (arraySend[j].idprovider == registrosProveedores[i].idprovider) {
                            arraySend[j].nameProvider = registrosProveedores[i].name;
                            break;
                          }
                        }
                      }
                      res.status(200).send({ response: arraySend });
                    });
                });
            });
        }
      })
      .catch(function () {
        res.status(400).send({ message: 'Error!' });
      });
  },
  getProviders: function (req, res) {
    req.models.providers.findAsync()
      .then(function (registros) {

        for (var j = 0; j < registros.length; j++) {
          registros[j].name = registros[j].name ? registros[j].name : '';
          registros[j].address = registros[j].address ? registros[j].address : '';
          registros[j].iddistrict = registros[j].iddistrict ? registros[j].iddistrict : '';
          registros[j].contact = registros[j].contact ? registros[j].contact : '';
          registros[j].phone = registros[j].phone ? registros[j].phone : '';
          registros[j].email = registros[j].email ? registros[j].email : '';
          registros[j].web = registros[j].web ? registros[j].web : '';
          registros[j].longitude = registros[j].longitude ? registros[j].longitude : 0;
          registros[j].latitude = registros[j].latitude ? registros[j].latitude : 0;
          registros[j].score = registros[j].score ? registros[j].score : 0;
          registros[j].descriptionTypeDocument = '';
        }

        req.models.typedocuments.findAsync()
          .then(function (registrosDocumentos) {
            for (var j = 0; j < registros.length; j++) {
              for (var i = 0; i < registrosDocumentos.length; i++) {
                if (registros[j].itypedocument  == registrosDocumentos[i].idtypedocument) {
                  registros[j].descriptionTypeDocument = registrosDocumentos[i].description;
                  break;
                }
              }
            }
            res.status(200).send({ response: registros });
          });
      })
      .catch(function (error) {
        res.status(400).send({ message: 'Error!' });
      });
  },



  /*------------TAREA 6----------------*/

  insertAlumns: function (req, res, jwt, app) {
    var row = {
      vNombres: req.body.vNombres,
      vApellidos: req.body.vApellidos,
      vDireccion: req.body.vDireccion
    }

    req.models.tarea6_alumnos.createAsync(row)
      .then(function (result) {
        req.models.tarea6_alumnos.findAsync()
          .then(function (registros) {
            res.status(200).send({ response: registros });
          });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  insertClients: function (req, res, jwt, app) {
    var row = {
      vNombre: req.body.vNombre,
      vCelular: req.body.vCelular,
      vDni: req.body.vDni
    }

    req.models.tarea6_clientes.createAsync(row)
      .then(function (result) {
        req.models.tarea6_clientes.findAsync()
          .then(function (registros) {
            res.status(200).send({ response: registros });
          });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  insertTeachers: function (req, res, jwt, app) {
    var row = {
      vNombres: req.body.vNombres,
      vApellidos: req.body.vApellidos,
      vEmail: req.body.vEmail
    }

    req.models.tarea6_docentes.createAsync(row)
      .then(function (result) {
        req.models.tarea6_docentes.findAsync()
          .then(function (registros) {
            res.status(200).send({ response: registros });
          });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  insertProducts: function (req, res, jwt, app) {
    var row = {
      vDescripcion: req.body.vDescripcion,
      iCantidad: req.body.iCantidad,
      vMarca: req.body.vMarca
    }

    req.models.tarea6_productos.createAsync(row)
      .then(function (result) {
        req.models.tarea6_productos.findAsync()
          .then(function (registros) {
            res.status(200).send({ response: registros });
          });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  },
  insertProviders: function (req, res, jwt, app) {
    var row = {
      vRazonSocial: req.body.vRazonSocial,
      vRUC: req.body.vRUC,
      vTelefono: req.body.vTelefono
    }

    req.models.tarea6_proveedores.createAsync(row)
      .then(function (result) {
        req.models.tarea6_proveedores.findAsync()
          .then(function (registros) {
            res.status(200).send({ response: registros });
          });
      })
      .catch(function () {
        res.status(400).send({ message: 'Error! con la conexion' });
      });
  }






}