"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("../constants");
const User_1 = __importDefault(require("../User"));
const Message_1 = __importDefault(require("../Message"));
const HTMLEmbedBuilder_1 = __importDefault(require("../HTMLEmbedBuilder"));
class Fetch {
    constructor(client) {
        this.client = client;
    }
    postJSON(method, path, json) {
        if (!this.client.token)
            return Promise.reject(new Error('Token not provided.'));
        return new Promise((resolve, reject) => {
            node_fetch_1.default(`https://supertiger.tk/${path}`, {
                // fetch(`http://localhost/${path}`, {
                method: method,
                headers: {
                    authorization: this.client.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            }).then(async (res) => {
                if (res.ok) {
                    resolve(await res.json());
                }
                else {
                    reject(await res.json());
                }
            })
                .catch(err => { reject(err); });
        });
    }
    send(content, opts, channel) {
        let fetch;
        if (opts.htmlEmbed && opts.htmlEmbed instanceof HTMLEmbedBuilder_1.default) {
            opts.htmlEmbed = opts.htmlEmbed.obj;
        }
        if (channel instanceof User_1.default) {
            fetch = this.client.fetch.createDM(channel).then(chan => this.postJSON('post', constants_1.END_POINTS.MESSAGES_CHANNELS_PATH + chan.id, Object.assign({ message: content }, opts)));
        }
        else {
            fetch = this.postJSON('post', constants_1.END_POINTS.MESSAGES_CHANNELS_PATH + channel.id, Object.assign({ message: content }, opts));
        }
        return fetch.then(data => new Message_1.default(data.messageCreated, this.client));
    }
    deleteMessage(channel, message) {
        return this.postJSON('delete', constants_1.END_POINTS.MESSAGES_PATH + `${message.id}/channels/${channel.id}`).then(() => {
            return message;
        });
    }
    edit(content, opts, message) {
        var _a;
        return this.postJSON('patch', `${constants_1.END_POINTS.MESSAGES + message.id}/channels/${(_a = message.channel) === null || _a === void 0 ? void 0 : _a.id}`, Object.assign({ message: content }, opts)).then(data => new Message_1.default(data, this.client));
    }
    createDM(recipient) {
        const channel = this.getExistingDM(recipient);
        if (channel)
            return Promise.resolve(channel);
        return this.postJSON('post', constants_1.END_POINTS.CHANNELS_PATH + recipient.id).then(({ channel }) => {
            const newChannel = this.client.dataManager.newChannel(channel);
            if (!newChannel)
                return Promise.reject(new Error('Failed to add channel.'));
            return newChannel;
        });
    }
    getExistingDM(user) {
        return this.client.channels.cache.find(channel => { var _a; return ((_a = channel.recipient) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
    }
    setStatus(status) {
        return this.postJSON('post', `${constants_1.END_POINTS.SETTINGS}/status`, { status });
    }
    setActivity(content) {
        return this.postJSON('post', `${constants_1.END_POINTS.SETTINGS}/custom-status`, { custom_status: content });
    }
    messageButtonCallback(channelID, messageID, buttonID, clickedByID, message) {
        return this.postJSON('patch', `${constants_1.END_POINTS.CHANNELS_PATH}${channelID}/messages/${messageID}/button/${buttonID}`, { clickedByID, message });
    }
    createRole(opts, guild) {
        return this.postJSON('post', `${constants_1.END_POINTS.SERVERS_PATH}${guild.id}/roles`, opts.data);
    }
    updateRole(opts, role, guild) {
        return this.postJSON('patch', `${constants_1.END_POINTS.SERVERS_PATH}${guild.id}/roles/${role.id}`, opts);
    }
}
exports.default = Fetch;
