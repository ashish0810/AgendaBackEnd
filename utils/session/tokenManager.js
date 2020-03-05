module.exports = class TokenManager {
    constructor() {
        console.log("Initializing Token Manager...");
        this.tokenData = {};
    }

    generateToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    getToken(user) {
        const currTime = new Date();
        if (this.tokenData[user] != undefined && currTime < this.tokenData[user].expTime) {
            console.log("Reusing user " + user + " token " + this.tokenData[user].token + " which expires " + this.tokenData[user].expTime);
            console.log(this.tokenData);
            return this.tokenData[user].token;
        } else {
            // generate new token, store, and return
            const token = this.generateToken();
            const expTime = new Date(currTime.getTime() + 30*60000);
            this.tokenData[user] = {
                token: token,
                genTime: currTime,
                expTime: expTime,
            };
            console.log("Assigned user " + user + " a token " + token + " which expires " + expTime);
            console.log(this.tokenData);
            return token;
        }
        
    }

    validateToken(user, token) {
        const currTime = new Date();
        return this.tokenData[user] != undefined && token == this.tokenData[user].token && currTime < this.tokenData[user].expTime;
    }
}