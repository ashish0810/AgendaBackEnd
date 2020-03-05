'use strict';
const crypto = require('crypto');

async function login(req, res, dbClient, tokenManager) {
    console.log('Received a request for POST /login');
    if (req.body == undefined || req.body.user == undefined || req.body.pass == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const { user, pass } = req.body;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    const response = await dbClient.getLoginInfo().catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The SQL Query failed',
            },
        });
    });
    if (response != undefined) {
        for (var i = 0; i < response.length; i++) {
            if (response[i].user == user && response[i].pass == hash) {
                const token = tokenManager.getToken(user);
                res.json({
                    'statusCode': 200,
                    'body': {
                        'user': user,
                        'name': response[i].name,
                        'class_value': response[i].class_value,
                        'token': token,
                    },
                });
                return
            }
        }
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'invalid',
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
    console.log('Got login info');
}

async function reg(req, res, dbClient, tokenManager) {
    console.log('Received a request for POST /login/reg');
    if (req.body == undefined || req.body.name == undefined || req.body.user == undefined || req.body.pass == undefined || req.body.classes == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const { name, user, pass, classes } = req.body;
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    const response1 = await dbClient.regUser(name, user, hash, classes).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The first SQL Query failed',
            },
        });
    });
    const response2 = await dbClient.createUserTable(user).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The second SQL Query failed',
            },
        });
    });
    if (response1 != undefined && response2 != undefined) {
        const token = tokenManager.getToken(user);
        res.json({
            'statusCode': 200,
            'body': {
                'user': user,
                'name': name,
                'class_value': classes,
                'token': token,
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
    console.log('Registered user ' + name + '(' + user + ')');
}

async function update(req, res, dbClient, tokenManager) {
    console.log('Received request for POST /login/update');
    if (req.body == undefined || req.body.name == undefined || req.body.user == undefined || req.body.classes == undefined || req.headers.token == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const { name, user, classes } = req.body;
    const token = req.headers.token;
    if (!tokenManager.validateToken(user, token)) {
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    var response;
    if (req.body.pass == undefined) {
        response = await dbClient.updateUser(user, name, classes).catch(function(reason) {
            res.json({
                'statusCode': 500,
                'body': {
                    'message': 'The SQL Query failed',
                },
            });
            return;
        });
    } else {
        const hash = crypto.createHash('sha256').update(req.body.pass).digest('hex');
        response = await dbClient.updateUserWithPass(user, name, classes, hash).catch(function(reason) {
            res.json({
                'statusCode': 500,
                'body': {
                    'message': 'The SQL Query failed',
                },
            });
            return;
        });
    }
    if (response != undefined) {
        res.json({
            'statusCode': 200,
            'body': {
                'user': user,
                'name': name,
                'class_value': classes,
                'token': token
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
    console.log('Updated user settings');
}

async function deleteUser(req, res, dbClient, tokenManager) {
    console.log('Received request for DELETE /login');
    if (req.body == undefined || req.body.user == undefined || req.headers.token == undefined) {
        res.json({
            'statusCode': 400,
            'body': {
                'message': 'Missing some parameters',
            },
        });
        return;
    }
    const user = req.body.user;
    const token = req.headers.token;
    if (!tokenManager.validateToken(user, token)) {
        res.json({
            'statusCode': 201,
            'body': {
                'message': 'Token expired or invalid',
            },
        });
        return;
    }
    const response1 = await dbClient.deleteUserLogin(user, token).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The first SQL Query failed',
            },
        });
        return;
    });
    const response2 = await dbClient.deleteUserTable(user).catch(function(reason) {
        res.json({
            'statusCode': 500,
            'body': {
                'message': 'The second SQL Query failed',
            },
        });
    });
    if (response1 != undefined && response2 != undefined) {
        res.json({
            'statusCode': 200,
            'body': {
                'message': 'User successfully deleted',
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
    console.log('Deleted user ' + user);
}

exports.login = login;
exports.reg = reg;
exports.update = update;
exports.delete = deleteUser;
