exports.RegisteredCVCollectionModel = function(mongo){
    
    return {

        getAllCVDocuments: function(){
            return new Promise((resolve, reject) =>{
                mongo.collection('registered_curriculums').find((err, result) =>{
                    if(!err){
                        resolve(result);
                    }else{
                        reject(err);
                    }
                });
            });
        },

        insertRegisteredCVDocuments: function(registeredCVDocument){
            return new Promise((resolve, reject) =>{
                mongo.collection('registered_curriculums').insert(registeredCVDocument, (err, result) => {
                    if(!err){
                        resolve(result);
                    }else{
                        reject(err);
                    }
                });
            });
        }
    }

}