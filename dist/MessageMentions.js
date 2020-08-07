"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("@discordjs/collection"));
class MessageMentions {
    constructor(message, client) {
        var _a, _b, _c;
        this.members = new collection_1.default();
        this.users = new collection_1.default();
        const result = (_b = (_a = message.content) === null || _a === void 0 ? void 0 : _a.match(/<@(\d+)>/g)) !== null && _b !== void 0 ? _b : [];
        for (let id of result) {
            id = id.slice(2, id.length - 1);
            const user = client.users.cache.get(id);
            if (user !== undefined) {
                this.users.set(id, user);
            }
            const member = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.members.get(id);
            if (member !== undefined) {
                this.members.set(id, member);
            }
        }
    }
}
exports.default = MessageMentions;
