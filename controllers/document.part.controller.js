exports.DocPartController = function(app, dbcon, mongo, neo4j) {

    const DocPartModel = require('../models/mysql/document.part.model.js').DocPartModel(dbcon);
    const Neo4jDocumentPartModel = require('../models/neo4j/document.part.model.js').DocumentPartModel(neo4j);
    
    var moment = require('moment');

    app.get('/getAllDocParts', (req, res) => {
        DocPartModel.getAllDocParts()
        .then((data) => {
            res.render('document_part', { 
                document_part : data,
                successMessage : '',
                moment : moment
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addDocPart"> Go Back</a>'
            });  
        });
    });
    
    app.get('/addDocPart', (req, res) => {
        res.render('addDocPart');
    });
    
    app.post('/addDocPart', (req, res) => {
        let mysqlAddPromise = DocPartModel.addDocPart(req.body.docId, req.body.docName);
        let neo4jAddPromise = Neo4jDocumentPartModel.addDocPart(req.body.docId, req.body.docName);

        Promise.all([mysqlAddPromise, neo4jAddPromise])
        .then((data) => {
            res.redirect('/getAllDocParts');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addDocPart"> Go Back</a>'
            });
        });
    });
    
    app.get('/editDocPartById/:id', (req, res) => {
        DocPartModel.getDocPartById(req.params.id)
        .then((data) => {
            res.render('editDocPart', {
                document_part : data[0],
                moment : moment
            });
        })
        .catch((err) => {
            res.send('editDocPart', err);
        });
    });
    
    app.post('/editDocPartById/:id', (req, res) => {
        let mysqlEditPromise = DocPartModel.editDocPartById(req.body.docId, req.body.docName, req.params.id);
        let neo4jEditPromise = Neo4jDocumentPartModel.editDocPartById(req.body.docId, req.body.docName, req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllDocParts');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editDocPartById/' + req.body.docId + ' "> Go back!</a>'
            });
        });
    });
    
    app.get('/deleteDocPartById/:id', (req, res) => {
        let mysqlDeletePromise = DocPartModel.deleteDocPartById(req.params.id);
        let neo4jDeletePromise = Neo4jDocumentPartModel.deleteDocPartById(req.params.id);

        Promise.all([mysqlDeletePromise, neo4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllDocParts');
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllDocParts"> Go Back</a>'
            });
        });
    });

}
