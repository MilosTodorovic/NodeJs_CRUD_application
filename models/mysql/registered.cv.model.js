exports.RegisteredCVModel = function(dbcon) {
    return {

        getAllTypes: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM TYPES_OF_INSTITUTIONS;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },

        getAllInstitutions: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM HIGH_EDUCATION_INSTITUTION;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },
        getAllCurriculumTypes: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM CURRICULUM_TYPE;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },

        // getCreationDateForCvById : function(id) {
        //     return new Promise((resolve, reject) => {
        //         let query = 'SELECT SP_DATUM_FORMIRANJA FROM REGISTERED_CURRICULUMS WHERE VU_IDENTIFIKATOR LIKE ?;';
        //         dbcon.query(query, [id], (err, data) => {
        //             if(!err) {
        //                 resolve(data);
        //             } else {
        //                 reject(err);
        //                 console.log(err);
        //             }
        //         });
        //     });
        // },

        // getEndDateForCvById : function(id) {
        //     return new Promise((resolve, reject) => {
        //         let query = 'SELECT SP_DATUM_UKIDANJA FROM REGISTERED_CURRICULUMS WHERE VU_IDENTIFIKATOR LIKE ?;';
        //         dbcon.query(query, [id], (err, data) => {
        //             if(!err) {
        //                 resolve(data);
        //             } else {
        //                 reject(err);
        //                 console.log(err);
        //             }
        //         });
        //     });
        // },

        getAllLanguages : function() {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM LANGUAGES;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },

        getAllCurriculumDegrees: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM CURRICULUM_DEGREE;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },
        getAllCurriculumLevels: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM CURRICULUM_LEVEL;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },
        getAllProfessions: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM PROFESSIONS;';
                dbcon.query(query, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                        console.log(err);
                    }
                });
            });
        },

        getCV : function() {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM REGISTERED_CURRICULUMS;';
                dbcon.query(query, (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        getAllCVsByInstitution : function(id) {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM REGISTERED_CURRICULUMS WHERE VU_IDENTIFIKATOR LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },
        

        getCVByNo : function(id) {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM REGISTERED_CURRICULUMS WHERE SP_EVIDENCIONI_BROJ LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        addCV : function(institutionType, institutionID, curriculum_types, evidenceNo, version, CV_name, c_date, e_date, sp_ects, langId, curriculumDeg, curriculumLvl, professions){
            return new Promise((resolve, reject) => {
                let query = "INSERT INTO REGISTERED_CURRICULUMS (TIP_UST, VU_IDENTIFIKATOR, TIPP_TIP, SP_EVIDENCIONI_BROJ, SP_VERZIJA, SP_NAZIV, SP_DATUM_FORMIRANJA, SP_DATUM_UKIDANJA, SP_ECTS, JEZ_JEZIK, STS_OZNAKA, NS_NIVO, SN_OZNAKA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                dbcon.query(query, [institutionType, institutionID, curriculum_types, evidenceNo, version, CV_name, c_date, e_date, sp_ects, langId, curriculumDeg, curriculumLvl, professions], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editCVById : function(institutionType, institutionID, curriculumType, evidenceNo, version, CV_name, c_date, e_date, sp_ects, langId, curriculumDeg, curriculumLvl, professions, id) {
            return new Promise((resolve, reject) => {
                let query = 'UPDATE REGISTERED_CURRICULUMS SET TIP_UST = ?, VU_IDENTIFIKATOR = ?, TIPP_TIP = ?, SP_EVIDENCIONI_BROJ = ?, SP_VERZIJA = ?, SP_NAZIV = ?, SP_DATUM_FORMIRANJA = ?, SP_DATUM_UKIDANJA = ?, SP_ECTS = ?,  JEZ_JEZIK = ?, STS_OZNAKA = ?, NS_NIVO = ?, SN_OZNAKA = ? WHERE SP_EVIDENCIONI_BROJ = ?;';
                dbcon.query(query, [institutionType, institutionID, curriculumType, evidenceNo, version, CV_name, c_date, e_date, sp_ects, langId, curriculumDeg, curriculumLvl, professions, id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        deleteCVByNo : function(id, type) {
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM REGISTERED_CURRICULUMS WHERE SP_EVIDENCIONI_BROJ LIKE ? AND TIPP_TIP LIKE ?;';
                dbcon.query(query, [id, type], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },
    }
    
}