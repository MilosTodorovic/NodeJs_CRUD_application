exports.InstanceCollectionModel = function(mongo){
    
    return {

        getAllInstanceDocuments: function(){
            return new Promise((resolve, reject) =>{
                mongo.collection('documentInstance').find((err, result) =>{
                    if(!err){
                        resolve(result);
                    }else{
                        reject(err);
                    }
                });
            });
        },

        insertInstanceDocuments: function(instanceDocument){
            return new Promise((resolve, reject) =>{
                mongo.collection('documentInstance').insert(instanceDocument, (err, result) => {
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