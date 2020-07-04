exports.RegisteredCVController = function(app, dbcon, mongo, neo4j) {

    const RegisteredCVModel = require('../models/mysql/registered.cv.model.js').RegisteredCVModel(dbcon);
    const InstitutionModel = require('../models/mysql/institution.model.js').InstitutionModel(dbcon);
    const RegisteredCVCollection = require('../models/mongodb/registeredCV.collection.js').RegisteredCVCollectionModel(mongo);
    const Neo4jRegisteredCvModel = require('../models/neo4j/registered.cv.model.js').RegisteredCVModel(neo4j);
    


    app.get('/getAllCVsByInstitution/:id', (req, res) => {
        let institutionInfo = InstitutionModel.getInstitutionById(req.params.id);
        let getAllCVsByInstitution = RegisteredCVModel.getAllCVsByInstitution(req.params.id);
        Promise.all([institutionInfo, getAllCVsByInstitution])
        .then((data) => {
            res.render('registered_curriculums', { 
                registered_curriculums : data[1],
                info : data[0][0]
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addCV"> Go Back</a>'
            });  
        });
    });
    
    app.get('/addCV/:vu/:vu_type', (req, res) => {
        let institutionInfo = InstitutionModel.getInstitutionById(req.params.vu);
        let getAllCVsByInstitution = RegisteredCVModel.getAllCVsByInstitution(req.params.vu);
        let getAllCurriculumTypes = RegisteredCVModel.getAllCurriculumTypes();
        let getAllLanguages = RegisteredCVModel.getAllLanguages();
        let getAllCurriculumDegrees = RegisteredCVModel.getAllCurriculumDegrees();
        let getAllCurriculumLevels = RegisteredCVModel.getAllCurriculumLevels();
        let getAllProfessions = RegisteredCVModel.getAllProfessions();
        Promise.all([institutionInfo, getAllCVsByInstitution, getAllCurriculumTypes, getAllLanguages, getAllCurriculumDegrees, getAllCurriculumLevels, getAllProfessions])
        .then((data) => {
                res.render('addCV', {
                    info: data[0][0],
                    cvs : data[1],
                    curriculum_type : data[2],
                    languages : data[3],
                    curriculum_degree : data[4],
                    curriculum_level : data[5],
                    professions : data[6],
                });
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err + '!',
                    link: 'ERROR: ' + err + ' <a href="/addCV">Goback!</a>'
                });
            })
    });
    
    var startDate, endDate;
    app.post('/addCV/:vu/:vu_type', (req, res) => {

        let getCV =  RegisteredCVModel.getCV();
        let getCurriculum =  RegisteredCVModel.addCV(req.params.vu_type, req.params.vu, req.body.curriculumType, req.body.evidenceNo, req.body.version, req.body.CV_name, req.body.c_date, req.body.e_date, req.body.sp_ects, req.body.langName, req.body.curriculumDeg, req.body.curriculumLvl, req.body.professions);
        let neo4jAddPromise = Neo4jRegisteredCvModel.addRegisteredCuriculum(req.params.vu_type, req.params.vu, req.body.curriculumType, req.body.evidenceNo, req.body.version, req.body.CV_name, req.body.sp_ects, req.body.langName, req.body.curriculumDeg, req.body.curriculumLvl, req.body.professions);

        Promise.all([getCV, getCurriculum, neo4jAddPromise])
        .then((data) => {
                startDate = req.body.c_date;
                endDate = req.body.e_date;
                res.redirect('/getAllCVsByInstitution/' + req.params.vu)
        })
        .catch((err) => {
            if (req.body.curriculumDeg != req.body.curriculumLvl) {
                res.render('message', {
                    errorMessage : 'ERROR: Curriculum level and Curriculum degree do not match! ' + err,
                    link : '<a href="/editCV/' + req.body.evidenceNo + ' "> Go back!</a>'
                })
            } 
            else {
                res.render('message', {
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/addCV/<%= info.VU_IDENTIFIKATOR%>/<%= info.TIP_UST %>"> Go Back</a>'
                });
            }
        });
    });
    
    app.get('/editCVById/:vu/:vu_type/:id', (req, res) => {

        // let getAllInstitutions = RegisteredCVModel.getAllInstitutions().then();
        // let getAllTypes = RegisteredCVModel.getAllTypes().then();
        let getAllCurriculumTypes = RegisteredCVModel.getAllCurriculumTypes();
        let getAllLanguages = RegisteredCVModel.getAllLanguages();
        let getAllCurriculumDegrees = RegisteredCVModel.getAllCurriculumDegrees();
        let getAllCurriculumLevels = RegisteredCVModel.getAllCurriculumLevels();
        let getAllProfessions = RegisteredCVModel.getAllProfessions();
        let getCVbyNo = RegisteredCVModel.getCVByNo(req.params.id);
        // var sDate = startDate;
        // var eDate = endDate;

        Promise.all([getAllCurriculumTypes, getAllLanguages, getAllCurriculumDegrees, getAllCurriculumLevels, getAllProfessions, getCVbyNo, /*sDate, eDate */])
        .then((data) => {
            res.render('editCVById', {
                curriculum_types : data[0],
                languages : data[1],
                curriculum_degree : data[2],
                curriculum_level : data[3],
                professions : data[4],
                registered_curriculums : data[5][0],
                // sDate : data[6],
                // eDate : data[7]
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editCVById/' + req.body.evidenceNo + ' "> Go back!</a>'
            });
        });
    });
    
    app.post('/editCVById/:vu/:vu_type/:id', (req, res) => {


        let mysqlEditPromise = RegisteredCVModel.editCVById(req.params.vu_type, req.params.vu, req.body.curriculumType, req.body.evidenceNo, req.body.version, req.body.CV_name, req.body.c_date, req.body.e_date, req.body.sp_ects,  req.body.langName, req.body.curriculumDeg, req.body.curriculumLvl, req.body.professions, req.params.id)
        let neo4jEditPromise = Neo4jRegisteredCvModel.editRegisteredCuriculumById(req.params.vu_type, req.params.vu, req.body.curriculumType, req.body.evidenceNo, req.body.version, req.body.CV_name, req.body.sp_ects, req.body.langName, req.body.curriculumDeg, req.body.curriculumLvl, req.body.professions, req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
                res.redirect('/getAllCVsByInstitution/' + req.params.vu);
        })
        .catch((err) => {
            if (req.body.curriculumDeg != req.body.curriculumLvl) {
                res.render('message', {
                    errorMessage : 'ERROR: Curriculum level and Curriculum degree do not match!   ' + err,
                    link : '<a href="/editCVById/' + req.body.evidenceNo + ' "> Go back!</a>'
                })
            }
            else {
                res.render('message', {
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/editCVById/' + req.body.evidenceNo + ' "> Go back!</a>'
                });
            };
        });
    });
    
    app.get('/deleteCVByNo/:vu/:ctype/:id', (req, res) => {
        let mysqlDeletePromise = RegisteredCVModel.deleteCVByNo(req.params.id, req.params.ctype);
        let neo4jDeletePromise = Neo4jRegisteredCvModel.deleteRegisteredCuriculumById(req.params.id);

        Promise.all([mysqlDeletePromise, neo4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllCVsByInstitution/' + req.params.vu);
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getCV"> Go Back</a>'
            });
        });
    });

    app.get('/registeredCVDocuments', (req, res) => {
        RegisteredCVCollection.getAllCVDocuments()
            .then((data) => {
                res.render('registeredCVDocuments', {
                    documents: data
                })
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage: 'ERROR: ' + err,
                    link: '<a href="/getCV"> Go Back</a>'
                })
            });
    });

    app.get('/generateCVDocument', (req, res) => {
        const allCVs = RegisteredCVModel.getCV();
        const allInstitutions = InstitutionModel.getAllInstitutions();

        Promise.all([allCVs, allInstitutions])
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: '+err,
                link : '<a href="/getCV"> Go Back</a>'
            })
        })
        .then(([registered_curriculums, institutions]) => {
            return new Promise((resolve, reject) => {
            registered_curriculums = registered_curriculums.map(CV => {
                return {
                    type : CV.TIP_UST,
                    id : CV.VU_IDENTIFIKATOR,
                    number_of_institutions: institutions.filter(institution => institution.TIP_UST == CV.TIP_UST).length,
                    institutions : institutions.filter(institution => institution.VU_IDENTIFIKATOR == CV.VU_IDENTIFIKATOR)
                    .map(institution => {
                        return{
                            id : institution.DR_IDENTIFIKATOR,
                            name : institution.VU_NAZIV
                        }
                    })
                }
            });

            if(registered_curriculums.length == 0){
                reject('No registered curriculums!');
            }
           
            resolve({
                created_at : JSON.stringify(new Date()),
                numberOfCurriculums : registered_curriculums.length,
                registered_curriculums : registered_curriculums
            });
        });
    })
    .catch((err) => {
        res.render('message', {
            errorMessage : 'ERROR: '+err,
            link : '<a href="/getCV"> Go Back</a>'
        });
    })
    .then((registeredCVDocuments) => {
        RegisteredCVCollection.insertRegisteredCVDocuments(registeredCVDocuments)
        .then(() => {
            res.redirect('registeredCVDocuments');
        });
    });
});
}


