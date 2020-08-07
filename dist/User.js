"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Presence_1 = __importDefault(require("./Presence"));
const constants_1 = require("./constants");
class User {
    constructor(user, client) {
        this.username = user.username;
        this.tag = `${user.username}:${user.tag}`;
        this.avatar = user.avatar;
        this.avatarURL = constants_1.END_POINTS.NERTIVIA_CDN + this.avatar;
        this.id = user.uniqueID;
        this.discriminator = user.tag;
        this.client = client;
        this.presence = new Presence_1.default('invisible', user.custom_status, this, this.client);
        this.bot = !!user.bot;
        if (user.status) {
            this.presence.status = user.status;
        }
    }
    toString() {
        return `<@${this.id}>`;
    }
    send(content, options = {}) {
        return this.client.fetch.send(content, options, this);
    }
}
exports.default = User;
