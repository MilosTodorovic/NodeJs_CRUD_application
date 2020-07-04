exports.RegisteredCVModel = function (neo4j) {
    return {

        getAllRegisteredCuriculums : function() {
            //TODO...
        },

        getRegisteredCuriculumById : function() {
            // TODO..
        },

        addRegisteredCuriculum : function(institution_type, institution_id, curriculum_types, evidence_no, version, CV_name, sp_ects, langId, curriculumDeg, curriculumLvl, professions) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH (hei:HIGH_EDUCATION_INSTITUTION {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id})  MERGE(r:REGISTERED_CURRICULUMS {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id, TIP_TIP : $curriculum_types, SP_EVIDENCIONI_BROJ : $evidence_no, SP_VERZIJA : $version, SP_NAZIV : $CV_name, SP_ETCS : $sp_ects, JEZ_JEZIK : $langId, STS_OZNAKA : $curriculumDeg, NS_NIVO : $curriculumLvl, SN_OZNAKA : $professions}) MERGE((r) -[rel:BELONGS_TO]-> (hei)) RETURN r, hei, rel';
                session.run(query, {institution_type : institution_type, institution_id : institution_id, curriculum_types : curriculum_types, evidence_no : evidence_no, version : version, CV_name : CV_name, sp_ects : sp_ects, langId : langId, curriculumDeg : curriculumDeg, curriculumLvl : curriculumLvl, professions : professions})
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

        editRegisteredCuriculumById : function(institution_type, institution_id, curriculum_types, new_evidenceNo, version, CV_name, sp_ects, langId, curriculumDeg, curriculumLvl, professions, old_evidenceNo) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = "MATCH (hei:HIGH_EDUCATION_INSTITUTION {TIP_UST : $institution_type, VU_IDENTIFIKATOR : $institution_id}) MERGE(r:REGISTERED_CURRICULUMS {SP_EVIDENCIONI_BROJ : $old_evidenceNo}) ON CREATE SET r.TIP_UST = $institution_type, r.VU_IDENTIFIKATOR = $institution_id, r.TIP_TIP = $curriculum_types, r.SP_EVIDENCIONI_BROJ = $new_evidenceNo, r.SP_VERZIJA = $version, r.SP_NAZIV = $CV_name, r.SP_ETCS = $sp_ects, r.JEZ_JEZIK = $langId, r.STS_OZNAKA = $curriculumDeg, r.NS_NIVO = $curriculumLvl, r.SN_OZNAKA = $professions ON MATCH SET r.TIP_UST = $institution_type, r.VU_IDENTIFIKATOR = $institution_id, r.TIP_TIP = $curriculum_types, r.SP_EVIDENCIONI_BROJ = $new_evidenceNo, r.SP_VERZIJA = $version, r.SP_NAZIV = $CV_name, r.SP_ETCS = $sp_ects, r.JEZ_JEZIK = $langId, r.STS_OZNAKA = $curriculumDeg, r.NS_NIVO = $curriculumLvl, r.SN_OZNAKA = $professions MERGE ((r) -[rel:BELONGS_TO]-> (di)) RETURN r, di, rel";
                session.run(query, {institution_type : institution_type, institution_id : institution_id, curriculum_types : curriculum_types, new_evidenceNo : new_evidenceNo, version : version, CV_name : CV_name, sp_ects : sp_ects, langId : langId, curriculumDeg : curriculumDeg, curriculumLvl : curriculumLvl, professions : professions, old_evidenceNo : old_evidenceNo})
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

        deleteRegisteredCuriculumById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = "MATCH(r:REGISTERED_CURRICULUMS {SP_EVIDENCIONI_BROJ : $id}) DETACH DELETE r";
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
};