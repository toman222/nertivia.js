"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Status_1 = require("./Interfaces/Status");
class Presence {
    constructor(status, activity, user, client) {
        this.user = user;
        this.client = client;
        this.activity = activity !== null && activity !== void 0 ? activity : null;
        this.status = typeof status === 'number' ? Status_1.PresenceStatusData[status] : status;
    }
}
exports.default = Presence;
