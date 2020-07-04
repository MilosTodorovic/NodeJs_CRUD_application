exports.StateModel = function(neo4j) {
    return {

        addState : function(state_id, state_name) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MERGE (s:STATE {DR_IDENTIFIKATOR : $state_id, DR_NAZIV : $state_name}) RETURN s';
                session.run(query, {state_id : state_id, state_name : state_name})
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

        editStateById : function(state_id, state_name,  id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MERGE (s:STATE {DR_IDENTIFIKATOR : $id}) ON CREATE SET s.DR_IDENTIFIKATOR = $state_id, s.DR_NAZIV = $state_name ON MATCH SET s.DR_IDENTIFIKATOR = $state_id, s.DR_NAZIV = $state_name';
                session.run(query, {state_id : state_id, state_name : state_name, id : id})
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

        deleteStateById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                query = 'MATCH (s:STATE {DR_IDENTIFIKATOR : $id}) DETACH DELETE s';
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