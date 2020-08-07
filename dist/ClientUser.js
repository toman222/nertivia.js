"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Status_1 = require("./Interfaces/Status");
class ClientUser extends User_1.default {
    setStatus(status) {
        if (Status_1.PresenceStatusData.indexOf(status) === -1) {
            return Promise.reject(new Error('Invalid Status.'));
        }
        return this.client.fetch.setStatus(Status_1.PresenceStatusData.indexOf(status)).then(() => {
            this.presence.status = status;
            return this.presence;
        });
    }
    // setActivity({ action: "Exploring", name: "Nertivia" })
    // setActivity("Bree")
    setActivity(content) {
        return this.client.fetch.setActivity(content).then(() => {
            this.presence.activity = content;
            return this.presence;
        });
    }
}
exports.default = ClientUser;
