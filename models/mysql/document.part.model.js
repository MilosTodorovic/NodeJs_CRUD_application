exports.DocPartModel = function(dbcon) {
    return {
        getAllDocParts : function() {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM DOCUMENT_PART;';
                dbcon.query(query, (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        getDocPartById : function(id) {
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM DOCUMENT_PART WHERE DOC_ID LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        addDocPart : function(docId, docName){
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO DOCUMENT_PART (DOC_ID, DOC_PARTH_NAME) VALUES (?, ?);';
                dbcon.query(query, [docId, docName], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editDocPartById : function(docId, docName,  id) {
            return new Promise((resolve, reject) => {
                let query = 'UPDATE DOCUMENT_PART SET DOC_ID = ?, DOC_PARTH_NAME = ? WHERE DOC_ID = ?;';
                dbcon.query(query, [docId, docName, id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        deleteDocPartById : function(id) {
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM DOCUMENT_PART WHERE  DOC_ID LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }
    }
}