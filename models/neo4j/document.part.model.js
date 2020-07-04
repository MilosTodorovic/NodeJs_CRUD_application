exports.DocumentPartModel = function (neo4j) {
    return {

        addDocPart : function(doc_id, doc_name) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MERGE (d:DOCUMENT_PART {DOC_ID : $doc_id, DOC_PATH_NAME : $doc_name}) RETURN d';
                session.run(query, {doc_id : doc_id, doc_name : doc_name})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                })
            })
        },
    
        editDocPartById : function(new_doc_id, doc_name,  old_doc_id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MERGE (d:DOCUMENT_PART {DOC_ID : $old_doc_id}) ON CREATE SET d.DOC_ID = $new_doc_id, d.DOC_PATH_NAME = $doc_name ON MATCH SET d.DOC_ID = $new_doc_id, d.DOC_PATH_NAME = $doc_name';
                session.run(query, {old_doc_id : old_doc_id, doc_name : doc_name, new_doc_id : new_doc_id})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                })
            })

        },


        deleteDocPartById : function(doc_id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH (d:DOCUMENT_PART {DOC_ID : $doc_id}) DETACH DELETE d';
                session.run(query, {doc_id : doc_id})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                })
            })
        }

    }
    
}