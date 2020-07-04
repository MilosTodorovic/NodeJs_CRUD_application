exports.MainController = function(app, dbcon, mongo) {
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/displayGraphs', (req, res) => {
        res.render('graphDisplayDocuments');
    });

    app.get('/displayGraphs2', (req, res) => {
        res.render('graphDiaplayRegisterCur');
    });

    app.get('/displayGraphs3', (req, res) => {
        res.render('graphDisplayAll');
    });

    app.get('/displayGraphs4', (req, res) => {
        res.render('graphDisplayAllRel');
    });

    app.get('/displayGraphs5', (req, res) => {
        res.render('graphDisplayRegCurDoc');
    });
}