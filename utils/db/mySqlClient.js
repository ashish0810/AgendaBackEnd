const mysql = require('mysql');

module.exports = class MySqlClient {
    constructor(host, user, password, database) {
        console.log("Initializing mySQL DB Client...");
        this.host = host == undefined ? 'hardCodedHost': host;
        this.user = user == undefined ? 'hardCodedUser': user;
        this.password = password == undefined ? 'hardCodedPass': password;
        this.database = database == undefined ? 'hardCodedDB': database;
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        });
    }

    executeQuery(sql) {
        const pool = this.pool;
        return new Promise(function(resolve, reject) {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                connection.query(sql, (err, response) => {
                    connection.release();
                    if (err) {
                        console.log(sql);
                        console.error(err);
                        return reject(err);
                    }
                    resolve(response);
                });
            });
        });
    }

    getLoginInfo() {
        const sql = `SELECT * FROM login`;
        return this.executeQuery(sql);
    }

    regUser(name, user, pass, classes) {
        const sql = `INSERT INTO login (user, pass, name, class_value) values ('${user}', '${pass}', '${name}', '${classes}')`;
        return this.executeQuery(sql);
    }

    createUserTable(user) {
        const sql = `CREATE TABLE ${user} (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, class tinytext, task tinytext, due date, stat char(1), progress int);`;
        return this.executeQuery(sql);
    }

    updateUser(user, name, classes) {
        const sql = `UPDATE login SET name='${name}', class_value='${classes}' WHERE user='${user}'`;
        return this.executeQuery(sql);
    }

    updateUserWithPass(user, name, classes, pass) {
        const sql = `UPDATE login SET pass='${pass}', name='${name}', class_value='${classes}' WHERE user='${user}'`;
        return this.executeQuery(sql);
    }

    deleteUserLogin(user) {
        const sql = `DELETE FROM login WHERE user='${user}'`;
        return this.executeQuery(sql);
    }

    deleteUserTable(user) {
        const sql = `DROP TABLE ${user}`;
        return this.executeQuery(sql);
    }

    getAllTasks(user) {
        const sql = `SELECT * FROM ${user} ORDER BY due`;
        return this.executeQuery(sql);
    }

    addTask(user, className, task, dueDate) {
        const sql = `INSERT INTO ${user} (class, task, due, stat, progress) VALUES ('${className}', '${task}', '${dueDate}', 'N', 0)`;
        return this.executeQuery(sql);
    }

    taskProgress(user, id, progress) {
        var stat = progress == 100 ? "D" : "N";
        const sql = `UPDATE ${user} SET stat='${stat}', progress=${progress} WHERE id='${id}'`;
        return this.executeQuery(sql);
    }

    updateTask(user, id, className, task, dueDate, progress) {
        var stat = progress == 100 ? "D" : "N";
        const sql = `UPDATE ${user} SET class='${className}', task='${task}', due='${dueDate}', stat='${stat}', progress=${progress} WHERE id='${id}'`;
        return this.executeQuery(sql);
    }

    deleteTask(user, id) {
        const sql = `DELETE FROM ${user} WHERE id='${id}'`;
        return this.executeQuery(sql);
    }
}
