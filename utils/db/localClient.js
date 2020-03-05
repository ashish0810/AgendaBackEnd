module.exports = class LocalClient {
    constructor() {
        console.log("Initializing Local DB Client...");
        this.data = {
            login: [
                {
                    "id": 1,
                    "user": "ashish0810",
                    "pass": "301a1847f636dc6d43331f37d598d6d9d207ace664911768da3eefb17b166607",
                    "name": "Ashish",
                    "color": "#ff0000",
                    "last_login": "2019-06-27T02:23:33.000Z",
                    "class_value": "CMSC330,CMSC351H,ENEE222,ENEE245,ENES210,CMSC389O,Agenda Development,Chat Development,Admin Page,Server"
                },
                {
                    "id": 2,
                    "user": "tester",
                    "pass": "9bba5c53a0545e0c80184b946153c9f58387e3bd1d4ee35740f29ac2e718b019",
                    "name": "Tester",
                    "color": "#041dfb",
                    "last_login": "2019-03-19T23:10:41.000Z",
                    "class_value": "Example Class 1,Example Class 2"
                },
            ],
            ashish0810: {
                count: 0,
                tasks: [],
            },
            tester: {
                count: 0,
                tasks: [],
            },
        };
    }

    getLoginInfo() {
        return this.data.login;
    }

    getAllTasks(user) {
        return this.data[user].tasks;
    }

    addTask(user, className, task, dueDate) {
        this.data[user].count++;
        this.data[user].tasks.push({
            "id": this.data[user].count,
            "class": className,
            "task": task,
            "due": dueDate,
            "stat": "N",
        });
        const returnValue = this.data[user].tasks[this.data[user].count - 1];
        return returnValue;
    }

    finishTask(user, id) {
        this.data[user].tasks[id-1].stat = "D";
        return this.data[user].tasks[id-1];
    }
}