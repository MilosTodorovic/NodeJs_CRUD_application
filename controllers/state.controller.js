exports.StateController = function(app, dbcon, mongo, neo4j) {

    const StateModel = require('../models/mysql/state.model.js').StateModel(dbcon);
    const InstitutionModel = require('../models/mysql/institution.model.js').InstitutionModel(dbcon);
    const StateCollection = require('../models/mongodb/state.collection.js').StateCollectionModel(mongo);
    const neo4jStateModel = require('../models/neo4j/state.model.js').StateModel(neo4j);
    var moment = require('moment');

    app.get('/getAllStates', (req, res) => {
        StateModel.getAllStates()
        .then((data) => {
            res.render('states', { 
                states : data,
                successMessage : '',
                moment : moment
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addState"> Go Back</a>'
            });  
        });
    });
    
    app.get('/addState', (req, res) => {
        res.render('addState');
    });
    
    app.post('/addState', (req, res) => {
        mysqlAddPromise = StateModel.addState(req.body.stateId, req.body.stateName);
        neo4jAddPromise = neo4jStateModel.addState(req.body.stateId, req.body.stateName);

        Promise.all([mysqlAddPromise, neo4jStateModel])
        .then((data) => {
            res.redirect('/getAllStates');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addState"> Go Back</a>'
            });
        });
    });
    
    app.get('/editStateById/:id', (req, res) => {
        StateModel.getStateById(req.params.id)
        .then((data) => {
            res.render('editState', {
                state : data[0],
                moment : moment
            });
        })
        .catch((err) => {
            res.send('editState', err);
        });
    });
    
    app.post('/editStateById/:id', (req, res) => {
        mysqlEditPromise = StateModel.editStateById(req.body.stateId, req.body.stateName,  req.params.id);
        neo4jEditPromise = neo4jStateModel.editStateById(req.body.stateId, req.body.stateName,  req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllStates');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editStateById/' + req.body.stateId + ' "> Go back!</a>'
            });
        });
    });
    
    app.get('/deleteStateById/:id', (req, res) => {
        mysqlDeletePromise = StateModel.deleteStateById(req.params.id);
        neo4jDeletePromise = neo4jStateModel.deleteStateById(req.params.id);

        Promise.all([mysqlDeletePromise, neo4jDeletePromise])        
        .then((data) => {
            res.redirect('/getAllStates');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllStates"> Go Back</a>'
            });
        });
    });

    app.get('/statesDocuments', (req, res) => {
        StateCollection.getAllStatesDocuments()
            .then((data) => {
                res.render('statesDocuments', {
                    documents: data
                })
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err,
                    link: '<a href="/getAllStates"> Go Back</a>'
                })
            });
    });

    app.get('/generateStatesDocument', (req, res) => {
        const allStates = StateModel.getAllStates();
        const allInstitutions = InstitutionModel.getAllInstitutions();

        Promise.all([allStates, allInstitutions])
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: '+err,
                link : '<a href="/getAllStates"> Go Back</a>'
            })
        })
        .then(([states, institutions]) => {
            return new Promise((resolve, reject) => {
            states = states.map(state => {
                return {
                    id : state.DR_IDENTIFIKATOR,
                    name : state.DR_NAZIV,
                    number_of_institutions: institutions.filter(institution => institution.DR_IDENTIFIKATOR == state.DR_IDENTIFIKATOR).length,
                    institutions : institutions.filter(institution => institution.DR_IDENTIFIKATOR == state.DR_IDENTIFIKATOR)
                    .map(institution => {
                        return{
                            id : institution.VU_IDENTIFIKATOR,
                            name : institution.VU_NAZIV
                        }
                    })
                }
            });

            if(states.length == 0){
                reject('No states!');
            }
           
            resolve({
                created_at : JSON.stringify(new Date()),
                numberOfStates : states.length,
                states : states
            });
        });
    })
    .catch((err) => {
        res.render('message', {
            errorMessage : 'ERROR: '+err,
            link : '<a href="/getAllStates"> Go Back</a>'
        });
    })
    .then((statesDocuments) => {
        StateCollection.insertStateDocuments(statesDocuments)
        .then(() => {
            res.redirect('statesDocuments');
        });
    });
});
}

