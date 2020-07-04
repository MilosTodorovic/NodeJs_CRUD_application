exports.DocumentInstanceModel = function (neo4j) {
    return {

        addDI : function (institution_type, institution_id, cur_type, cur_num, cur_ver, doc_id, di_seg) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(r:REGISTERED_CURRICULUMS {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id}) MATCH (d:DOCUMENT_PART {DOC_ID : $doc_id}) MERGE (di:DOCUMENT_INSTANCE {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id, TIPP_TIP : $cur_type, SP_EVIDENCIONI_BROJ : $cur_num, SP_VERZIJA : $cur_ver, DIN_SEGMENT_ID : $di_seg}) MERGE((d) -[rel:BELONGS_TO]->(di)) MERGE((di) -[rel2:BELONGS_TO]-> (r)) RETURN d, di, r, rel, rel2';
                session.run(query, {institution_type : institution_type, institution_id : institution_id, cur_type : cur_type, cur_num : cur_num, cur_ver : cur_ver, doc_id : doc_id, di_seg : di_seg})
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

        editDIById : function (institution_type, institution_id, cur_type, cur_num, cur_ver, doc_id, di_seg, id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(r:REGISTERED_CURRICULUMS {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id}) MATCH (d:DOCUMENT_PART {DOC_ID : $doc_id}) MERGE (di:DOCUMENT_INSTANCE {DIN_SEGMENT_ID : $id}) ON CREATE SET di.TIP_UST = $institution_type, di.VU_IDENTIFIKATOR = $institution_id, di.TIPP_TIP = $cur_type, di.SP_EVIDENCIONI_BROJ = $cur_num, di.SP_VERZIJA = $cur_ver, di.DIN_SEGMENT_ID = $di_seg ON MATCH SET di.TIP_UST = $institution_type, di.VU_IDENTIFIKATOR = $institution_id, di.TIPP_TIP = $cur_type, di.SP_EVIDENCIONI_BROJ = $cur_num, di.SP_VERZIJA = $cur_ver, di.DIN_SEGMENT_ID = $di_seg MERGE ((d) -[rel:BELONGS_TO]->(di)) MERGE((di) -[rel2:BELONGS_TO]-> (r)) RETURN d, di, r, rel, rel2';
                session.run(query, {institution_type : institution_type, institution_id : institution_id, cur_type : cur_type, cur_num : cur_num, cur_ver : cur_ver, doc_id : doc_id, di_seg : di_seg, id : id})
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

        deleteDIById : function (id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH (di:DOCUMENT_INSTANCE {DIN_SEGMENT_ID : $id}) DETACH DELETE di';
                session.run(query, {id : id})
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