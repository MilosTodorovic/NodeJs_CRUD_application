exports.InstitutionModel = (neo4j) => {
    return {

        addInstitution: (institution_id, institution_name, institution_type, state_id, ownership_type) => {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(s:STATE {DR_IDENTIFIKATOR: $state_id}) MERGE (hei:HIGH_EDUCATION_INSTITUTION {VU_IDENTIFIKATOR : $institution_id, VU_NAZIV : $institution_name, TIP_UST : $institution_type, DR_IDENTIFIKATOR : $state_id, VV_OZNAKA : $ownership_type}) MERGE ((hei) - [r:BELONGS_TO] -> (s)) RETURN hei, s, r';
                session.run(query, { institution_id : institution_id, institution_name : institution_name, institution_type : institution_type, state_id : state_id, ownership_type : ownership_type})
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
                    .then(() => {
                        session.close();
                    })
            });
        },

        editInstitutionById: (institution_type, institution_name, state_id, ownership_type, id) => {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(s:STATE {DR_IDENTIFIKATOR : $state_id}) MERGE(hei:HIGH_EDUCATION_INSTITUTION {VU_IDENTIFIKATOR : $id, TIP_UST : $institution_type}) ON CREATE SET hei.VU_IDENTIFIKATOR = $id, hei.VU_NAZIV = $institution_name, hei.TIP_UST = $institution_type, hei.VV_OZNAKA = $ownership_type ON MATCH SET hei.VU_IDENTIFIKATOR = $id, hei.VU_NAZIV = $institution_name, hei.TIP_UST = $institution_type, hei.VV_OZNAKA = $ownership_type MERGE((hei)-[r:BELONGS_TO]->(s)) RETURN hei, s, r';
                session.run(query, {institution_type : institution_type, institution_name : institution_name, state_id : state_id, ownership_type : ownership_type, id : id})
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
                    .then(() => {
                        session.close();
                    })
            });
        },

        deleteInstitutionById: (id) => {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(hei:HIGH_EDUCATION_INSTITUTION {VU_IDENTIFIKATOR: $id}) DETACH DELETE hei';
                session.run(query, { id: id})
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
                    .then(() => {
                        session.close();
                    })
            });
        }
    }
}  