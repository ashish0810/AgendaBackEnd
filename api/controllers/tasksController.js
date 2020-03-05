'use strict';

async function getAllTasks(req, res, dbClient, tokenManager) {
    console.log('Received a request for GET /tasks');
    if (req.query == undefined || req.query.user == undefined || req.headers.token == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.query.user;
    const token = req.headers.token;
    if (!tokenManager.validateToken(user, token)) {
        console.log("Token expired or invalid");
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response = await dbClient.getAllTasks(user).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
        return;
    });
    if (response != undefined) {
        res.json({
            'statusCode': 200,
            'body': {
                'username': user,
                'tasks': response,
            },
        });
    } else {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'something failed',
            },
        });
    }
    console.log('Got tasks and returned them to user');
}

async function addTask(req, res, dbClient, tokenManager) {
    console.log('Received a request for POST /tasks');
    if (req.query == undefined || req.query.user == undefined || req.headers.token == undefined ||
        req.body == undefined || req.body.className == undefined || req.body.task == undefined || req.body.dueDate == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.query.user;
    const token = req.headers.token;
    const { className, task, dueDate } = req.body;
    if (!tokenManager.validateToken(user, token)) {
        console.log("Token expired or invalid");
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response = await dbClient.addTask(user, className, task, dueDate).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
    });
    if (response) {
        res.json({
            'statusCode': 200,
            'body': {
                'inputs': {
                    'user': user,
                    'className': className,
                    'task': task,
                    'dueDate': dueDate,
                },
            },
        });
    } else {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'something failed',
            },
        });
    }
    console.log('Added task to database');
}

async function taskProgress(req, res, dbClient, tokenManager) {
    console.log('Received a request for PUT /tasks');
    if (req.query == undefined || req.query.user == undefined || req.headers.token == undefined || req.body == undefined || req.body.taskId == undefined || req.body.progress == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.query.user;
    const token = req.headers.token;
    const taskId = req.body.taskId;
    const progress = req.body.progress;
    if (!tokenManager.validateToken(user, token)) {
        console.log("Token expired or invalid");
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response = await dbClient.taskProgress(user, taskId, progress).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
    });
    if (response) {
        res.json({
            'statusCode': 200,
            'body': {
                'inputs': {
                    'user': user,
                    'taskId': taskId,
                    'progress': progress,
                },
            },
        });
    } else {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'something failed',
            },
        });
    }
    console.log('Marked task as finished');
}

async function updateTask(req, res, dbClient, tokenManager) {
    console.log('Received a request for POST /tasks/update');
    if (req.query == undefined || req.query.user == undefined || req.headers.token == undefined ||
        req.body == undefined || req.body.id == undefined || req.body.className == undefined || req.body.task == undefined ||
        req.body.dueDate == undefined || req.body.progress == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.query.user;
    const token = req.headers.token;
    const { id, className, task, dueDate, progress } = req.body;
    if (!tokenManager.validateToken(user, token)) {
        console.log("Token expired or invalid");
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response = await dbClient.updateTask(user, id, className, task, dueDate, progress).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
    });
    if (response) {
        res.json({
            'statusCode': 200,
            'body': {
                'inputs': {
                    'user': user,
                    'taskId': id,
                    'className': className,
                    'task': task,
                    'dueDate': dueDate,
                    'progress': progress,
                },
            },
        });
    } else {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'something failed',
            },
        });
    }
    console.log('Edited task');
}

async function deleteTask(req, res, dbClient, tokenManager) {
    console.log('Received a request for DELETE /tasks');
    if (req.query == undefined || req.query.user == undefined || req.headers.token == undefined || req.body == undefined || req.body.id == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.query.user;
    const token = req.headers.token;
    const id = req.body.id;
    if (!tokenManager.validateToken(user, token)) {
        console.log("Token expired or invalid");
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response = await dbClient.deleteTask(user, id).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
    });
    if (response) {
        res.json({
            'statusCode': 200,
            'body': {
                'inputs': {
                    'user': user,
                    'taskId': id,
                },
            },
        });
    } else {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'something failed',
            },
        });
    }
    console.log('Edited task');
}

exports.getAllTasks = getAllTasks;
exports.addTask = addTask;
exports.taskProgress = taskProgress;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
