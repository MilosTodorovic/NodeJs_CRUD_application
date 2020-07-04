exports.DocumentInstanceModel = function (dbcon) {
    return {
        getAllDI : function () {
            return new Promise ((resolve, reject) => {
                let query = "SELECT * FROM DOCUMENT_INSTANCE;";
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
        getAllCurrTypes: function () {
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

        getAllRC: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM REGISTERED_CURRICULUMS;';
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

        getAllDocPart: function () {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM DOCUMENT_PART;';
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

        

        getDIById : function (id) {
            return new Promise((resolve, reject) => {
                let query = "SELECT * FROM DOCUMENT_INSTANCE WHERE DIN_SEGMENT_ID LIKE ?;";
                dbcon.query(query, [id], (err, data) => {
                    if (!err) {
                        resolve (data);
                    } else {
                        reject (err);
                    }
                });
            });
        }, 

        addDI : function (institutionType, institutionId, curType, curNum, curVer, docID, DISeg) {
            return new Promise((resolve, reject) => {
                let query = "INSERT INTO DOCUMENT_INSTANCE (TIP_UST, VU_IDENTIFIKATOR, TIPP_TIP, SP_EVIDENCIONI_BROJ, SP_VERZIJA, DOC_ID, DIN_SEGMENT_ID) VALUES (?, ?, ?, ?, ?, ?, ?);";
                dbcon.query(query, [institutionType, institutionId, curType, curNum, curVer, docID, DISeg], (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editDIById : function (institutionType, institutionId, curType, curNum, curVer, docID, DISeg, id) {
            return new Promise((resolve, reject) => {
                let query = "UPDATE DOCUMENT_INSTANCE SET TIP_UST = ?, VU_IDENTIFIKATOR = ?, TIPP_TIP = ?, SP_EVIDENCIONI_BROJ = ?, SP_VERZIJA = ?, DOC_ID = ?, DIN_SEGMENT_ID = ? WHERE DIN_SEGMENT_ID LIKE ?;";
                dbcon.query(query, [institutionType, institutionId, curType, curNum, curVer, docID, DISeg, id], (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }, 

        deleteDIById : function (id) {
            return new Promise((resolve, reject) => {
                let query = "DELETE FROM DOCUMENT_INSTANCE WHERE DIN_SEGMENT_ID LIKE ?;";
                dbcon.query(query, [id], (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }
    };
};