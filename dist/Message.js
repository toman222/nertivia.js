"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageMentions_1 = __importDefault(require("./MessageMentions"));
class Message {
    constructor(message, client) {
        var _a, _b, _c;
        this.id = message.messageID;
        this.content = message.message;
        this.author = (_a = client.users.cache.get(message.creator.uniqueID)) !== null && _a !== void 0 ? _a : (() => { throw new Error('Message has invalid author. ID: ' + message.creator.uniqueID); })();
        this.channel = client.channels.cache.get(message.channelID);
        this.guild = (_b = this.channel) === null || _b === void 0 ? void 0 : _b.guild;
        this.member = (_c = this.guild) === null || _c === void 0 ? void 0 : _c.members.get(message.creator.uniqueID);
        this.client = client;
        this.mentions = new MessageMentions_1.default(this, this.client);
    }
    send(content, options = {}) {
        var _a;
        return (_a = this.channel) === null || _a === void 0 ? void 0 : _a.send(content, options);
    }
    edit(content, options = {}) {
        return this.client.fetch.edit(content, options, this);
    }
    reply(content, options = {}) {
        var _a;
        return (_a = this.channel) === null || _a === void 0 ? void 0 : _a.send(`<@${this.author.id}>, ${content}`, options);
    }
    delete(delay = 0) {
        setTimeout(() => {
            return this.client.fetch.deleteMessage(this.channel, this);
        }, delay);
    }
}
exports.default = Message;
