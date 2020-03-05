'use strict';
const loginController = require('../controllers/loginController');

module.exports = function(app, dbClient, tokenManager) {
    console.log('Loading login routes...');

    // POST /login
    app.post('/login', (req, res) => {
        loginController.login(req, res, dbClient, tokenManager);
    });

    // POST /login/reg
    app.post('/login/reg', (req, res) => {
        loginController.reg(req, res, dbClient, tokenManager);
    });

    // POST /login/update
    app.post('/login/update', (req, res) => {
        loginController.update(req, res, dbClient, tokenManager);
    });

    // DELETE /login
    app.delete('/login', (req, res) => {
        loginController.delete(req, res, dbClient, tokenManager);
    });
}