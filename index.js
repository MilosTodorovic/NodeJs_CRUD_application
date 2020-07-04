const { app, dbcon, mongo, neo4j } = require('./core/app.config.js').AppConfig();

require('./controllers/main.controller.js').MainController(app, dbcon, mongo, neo4j);
require('./controllers/state.controller.js').StateController(app, dbcon, mongo, neo4j);
require('./controllers/institution.controller.js').InstitutionController(app, dbcon, mongo, neo4j);
require('./controllers/registered.cv.controller.js').RegisteredCVController(app, dbcon, mongo, neo4j);
require('./controllers/document.part.controller.js').DocPartController(app, dbcon, mongo, neo4j);
require('./controllers/document.instance.controller.js').DocumentInstanceController(app, dbcon, mongo, neo4j);

