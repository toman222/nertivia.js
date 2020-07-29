"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
const User_1 = __importDefault(require("./User"));
class DataManager {
    constructor(client) {
        this.client = client;
    }
    newChannel(data, guild) {
        const channel = new Channel_1.default(data, this.client);
        if (data.server_id !== undefined) {
            guild = guild !== null && guild !== void 0 ? guild : this.client.guilds.cache.get(data.server_id);
            if (guild === undefined) {
                throw new Error('Tried to create invalid channel in DataManager (Has invalid server_id)');
            }
            guild.channels.set(data.channelID, channel);
        }
        this.client.channels.cache.set(channel.id, channel);
        return channel;
    }
    newUser(data) {
        let user = this.client.users.cache.get(data.uniqueID);
        if (user === undefined) {
            user = new User_1.default(data, this.client);
            this.client.users.cache.set(user.id, user);
        }
        return user;
    }
}
exports.default = DataManager;
