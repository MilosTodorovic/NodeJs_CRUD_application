exports.DocumentInstanceController = function(app, dbcon, mongo, neo4j) {
    const documentInstanceModel = require('../models/mysql/document.instance.model.js').DocumentInstanceModel(dbcon);
    const documentPartModel = require('../models/mysql/document.part.model.js').DocPartModel(dbcon);
    const instanceCollection = require('../models/mongodb/document.instance.collection.js').InstanceCollectionModel(mongo);
    const neo4jDocumentInstanceModel = require('../models/neo4j/document.instance.model.js').DocumentInstanceModel(neo4j)

    var moment = require('moment');

    app.get('/getAllDI', (req, res) => {
        documentInstanceModel.getAllDI()
        .then((data) => {
            res.render('documentInstance', {
                documentInstance : data,
                successMessage : '',
                moment : moment
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
            });
        });
    });

    app.get('/addDI', (req, res) => {

        let getAllTypes = documentInstanceModel.getAllTypes().then();
        let getAllInstitutions = documentInstanceModel.getAllInstitutions().then();
        let getAllCurrTypes = documentInstanceModel.getAllCurrTypes().then();
        let getAllRC = documentInstanceModel.getAllRC().then();
        let getAllDocPart = documentInstanceModel.getAllDocPart().then();

        Promise.all([getAllTypes, getAllInstitutions, getAllCurrTypes, getAllRC, getAllDocPart])
        .then((data) => {
            res.render('addDI', {
                types_of_institutions : data[0],
                high_education_institutions : data[1],
                curriculum_type: data[2],
                registered_curriculum : data[3],
                doc_part : data[4]
            });
        })
            .catch((err) => {
                res.render('message', {
                    errorMessage : 'ERROR :' + err,
                    link: 'ERROR: ' + err + ' <a href="/addDI">Goback!</a>'
                });
            });
    });

    app.post('/addDI', (req, res) => {

        let getAllDI = documentInstanceModel.getAllDI();
        let getDI = documentInstanceModel.addDI(req.body.institutionType, req.body.institutionId, req.body.curType, req.body.curNum, req.body.curVer, req.body.docID, req.body.DISeg);
        let neo4jAddPromise = neo4jDocumentInstanceModel.addDI(req.body.institutionType, req.body.institutionId, req.body.curType, req.body.curNum, req.body.curVer, req.body.docID, req.body.DISeg);

        Promise.all([getAllDI, getDI, neo4jAddPromise])
        .then((data) => {
            res.redirect('/getAllDI');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR :' + err,
                link : '<a href="/addDI"> Go Back</a>'
            });
        });
    });

    app.get('/editDIById/:id', (req, res) => {

        let getAllTypes = documentInstanceModel.getAllTypes().then();
        let getAllInstitutions = documentInstanceModel.getAllInstitutions().then();
        let getAllCurrTypes = documentInstanceModel.getAllCurrTypes().then();
        let getAllRC = documentInstanceModel.getAllRC().then();
        let getAllDocPart = documentInstanceModel.getAllDocPart().then();
        let getDIById = documentInstanceModel.getDIById(req.params.id).then();

        Promise.all([getAllTypes, getAllInstitutions, getAllCurrTypes, getAllRC, getAllDocPart, getDIById]).then((data) => {
            res.render('editDI', {
                types_of_institutions : data[0],
                high_education_institutions : data[1],
                curriculum_type: data[2],
                registered_curriculum : data[3],
                doc_part : data[4],
                documentInstance: data[5][0],
                moment : moment
            });
        })
            .catch((err) => {
                res.send('editDI', err);
            });
    });

    app.post('/editDIById/:id', (req, res) => {
        let mysqlEditPromise = documentInstanceModel.editDIById(req.body.institutionType, req.body.institutionId, req.body.curType, req.body.curNum, req.body.curVer, req.body.docID, req.body.DISeg, req.params.id);
        let neo4jEditPromise = neo4jDocumentInstanceModel.editDIById(req.body.institutionType, req.body.institutionId, req.body.curType, req.body.curNum, req.body.curVer, req.body.docID, req.body.DISeg, req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllDI');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editDIById/' + req.body.DISeg + ' "> Go back!</a>'
            });
        });
    });

    app.get('/deleteDIById/:id', (req, res) => {
        let mysqlDeletePromise = documentInstanceModel.deleteDIById(req.params.id);
        let noe4jDeletePromise = neo4jDocumentInstanceModel.deleteDIById(req.params.id);

        Promise.all([mysqlDeletePromise, noe4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllDI');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllDI"> Go Back</a>'
            });
        });
    });

    app.get('/instanceDocuments', (req, res) => {
        instanceCollection.getAllInstanceDocuments()
            .then((data) => {
                res.render('instanceDocuments', {
                    documents: data
                })
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err,
                    link: '<a href="/getAllDI"> Go Back</a>'
                })
            });
    });

    app.get('/generateInstanceDocument', (req, res) => {
        const allDI = documentInstanceModel.getAllDI();
        const allDP = documentPartModel.getAllDocParts();

        Promise.all([allDI, allDP])
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: '+err,
                link : '<a href="/getAllDI"> Go Back</a>'
            })
        })
        .then(([documentInstance, document_part]) => {
            return new Promise((resolve, reject) => {
                documentInstance = documentInstance.map(DI => {
                return {
                    id : DI.DOC_ID,
                    number_of_DPs: document_part.filter(DP => DP.DOC_ID == DI.DOC_ID).length,
                    numberOfInstances : document_part.filter(DP => DP.DOC_ID == DI.DOC_ID)
                    .map(DP => {
                        return{
                            id : DP.DOC_ID,
                            name : DP.DOC_PARTH_NAME
                            
                        }
                    })
                }
            });

            if(documentInstance.length == 0){
                reject('No document instances!');
            }
           
            resolve({
                created_at : JSON.stringify(new Date()),
                numberOfInstances : documentInstance.length,
                documentInstance : documentInstance
            });
        });
    })
    .catch((err) => {
        res.render('message', {
            errorMessage : 'ERROR: '+err,
            link : '<a href="/getAllDI"> Go Back</a>'
        });
    })
    .then((instanceDocument) => {
        instanceCollection.insertInstanceDocuments(instanceDocument)
        .then(() => {
            res.redirect('instanceDocuments');
        });
    });
});
}




