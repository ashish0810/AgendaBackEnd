'use strict';
const taskController = require('../controllers/tasksController');

module.exports = function(app, dbClient, tokenManager) {
    console.log('Loading task routes...');

    // GET /tasks
    app.get('/tasks', (req, res) => {
        taskController.getAllTasks(req, res, dbClient, tokenManager);
    });

    // POST /tasks
    app.post('/tasks', (req, res) => {
        taskController.addTask(req, res, dbClient, tokenManager);
    });

    // PUT /tasks
    app.put('/tasks', (req, res) => {
        taskController.taskProgress(req, res, dbClient, tokenManager);
    });

    // POST /tasks/update
    app.post('/tasks/update', (req, res) => {
        taskController.updateTask(req, res, dbClient, tokenManager);
    });

    // DELETE /tasks
    app.delete('/tasks', (req, res) => {
        taskController.deleteTask(req, res, dbClient, tokenManager);
    });
}