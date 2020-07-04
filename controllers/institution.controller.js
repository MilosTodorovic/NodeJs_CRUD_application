exports.InstitutionController = function(app, dbcon, mongo, neo4j) {
    const InstitutionModel = require('../models/mysql/institution.model.js').InstitutionModel(dbcon);
    const RegisteredCVModel = require('../models/mysql/registered.cv.model.js').RegisteredCVModel(dbcon);
    const institutionCollection = require('../models/mongodb/institution.collection.js').InstitutionCollectionModel(mongo);
    const neo4jInsititutionModel = require('../models/neo4j/institution.model.js').InstitutionModel(neo4j);

    app.get('/getAllInstitutions', (req, res) => {
        InstitutionModel.getAllInstitutions()
        .then((data) => {
            res.render('institutions', {
                institutions : data,
                successMessage : ''
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
            });  
        });
    });

    app.get('/addInstitution', (req, res) => {

        let getAllStates = InstitutionModel.getAllStates();
        let getAllTypes = InstitutionModel.getAllTypes();
        let getAllOwnerships = InstitutionModel.getAllOwnerships();
        
        Promise.all([getAllStates, getAllTypes, getAllOwnerships])
        .then((data) => {
                res.render('addInstitution', {
                    states : data[0],
                    types : data[1],
                    ownerships : data[2]
                });
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err + '!',
                    link: 'ERROR: ' + err + ' <a href="/addInstitution">Goback!</a>'
                });
            })
    });

    app.post('/addInstitution', (req, res) => {

        let getAllInstitutions = InstitutionModel.getAllInstitutions();
        let mysqlAddPromise = InstitutionModel.addInstitution(req.body.institutionId, req.body.institutionName, req.body.institutionType, req.body.stateId, req.body.ownershipType);
        let neo4jAddPromise = neo4jInsititutionModel.addInstitution(req.body.institutionId, req.body.institutionName, req.body.institutionType, req.body.stateId, req.body.ownershipType);

        Promise.all([getAllInstitutions, mysqlAddPromise, neo4jAddPromise])
        .then((data) => {
            res.redirect('/getAllInstitutions');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addInstitution"> Go Back</a>'
            });
        });
    });

    app.get('/editInstitutionById/:id', (req, res) => {
        let getAllStates = InstitutionModel.getAllStates().then();
        let getAllTypes = InstitutionModel.getAllTypes().then();
        let getAllOwnerships = InstitutionModel.getAllOwnerships().then();
        let getInstitution = InstitutionModel.getInstitutionById(req.params.id).then();
        
        Promise.all([getAllStates, getAllTypes, getAllOwnerships, getInstitution]).then((data) => {
            res.render('editInstitution', {
                states : data[0],
                types : data[1],
                ownerships : data[2],
                institution : data[3][0]
            });
        })
            .catch((err) => {
                res.send('editInstitution', err);
            });
    });

    // [[{hs},{un}] , [ {}, {} ]];

    app.post('/editInstitutionById/:id', (req, res) => {
        let mysqlEditPromise = InstitutionModel.editInstitutionById(req.body.institutionType, req.body.institutionName, req.body.stateId, req.body.ownershipType, req.params.id);
        let neo4jEditPromise = neo4jInsititutionModel.editInstitutionById(req.body.institutionType, req.body.institutionName, req.body.stateId, req.body.ownershipType, req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllInstitutions');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editInstitutionById/' + req.body.institutionId + ' "> Go back!</a>'
            });
        });
    });

    app.get('/deleteInstitutionById/:id', (req, res) => {
        let mysqlDeletePromise = InstitutionModel.deleteInstitutionById(req.params.id);
        let neo4jDeletePromise = neo4jInsititutionModel.deleteInstitutionById(req.params.id);

        Promise.all([mysqlDeletePromise, neo4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllInstitutions');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllInstitutions"> Go Back</a>'
            });
        });
    });
    app.get('/institutionsDocuments', (req, res) => {
        institutionCollection.getAllInstitutionDocuments()
            .then((data) => {
                res.render('institutionDocuments', {
                    documents: data
                })
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err,
                    link: '<a href="/getAllInstitutions"> Go Back</a>'
                })
            });
    });

    app.get('/generateInstitutionsDocument', (req, res) => {
        const allInstitutions = InstitutionModel.getAllInstitutions();
        const allCVs = RegisteredCVModel.getCV();

        Promise.all([allInstitutions, allCVs])
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: '+err,
                link : '<a href="/getAllInstitutions"> Go Back</a>'
            })
        })
        .then(([institutions, registered_curriculums]) => {
            return new Promise((resolve, reject) => {
                institutions = institutions.map(institution => {
                return {
                    type : institution.TIP_UST,
                    id : institution.VU_IDENTIFIKATOR,
                    number_of_CVs: registered_curriculums.filter(CV => CV.TIP_UST == institution.TIP_UST).filter(CV => CV.VU_IDENTIFIKATOR == institution.VU_IDENTIFIKATOR).length,
                    registered_curriculums : registered_curriculums.filter(CV => CV.TIP_UST == institution.TIP_UST).filter(CV => CV.VU_IDENTIFIKATOR == institution.VU_IDENTIFIKATOR)
                    .map(CV => {
                        return{
                            CVtype : CV.TIPP_TIP,
                            evidence_number : CV.SP_EVIDENCIONI_BROJ,
                            version : CV.SP_VERZIJA
                        }
                    })
                }
            });

            if(institutions.length == 0){
                reject('No institutions!');
            }
           
            resolve({
                created_at : JSON.stringify(new Date()),
                numberOfInstitutions : institutions.length,
                institutions : institutions
            });
        });
    })
    .catch((err) => {
        res.render('message', {
            errorMessage : 'ERROR: '+err,
            link : '<a href="/getAllInstitutions"> Go Back</a>'
        });
    })
    .then((institutionDocument) => {
        institutionCollection.insertInstitutionDocuments(institutionDocument)
        .then(() => {
            res.redirect('institutionsDocuments');
        });
    });
});
}

