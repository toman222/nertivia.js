"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Channel {
    constructor(channel, client) {
        this.name = channel.name;
        this.id = channel.channelID;
        if (channel.server_id !== undefined) {
            this.guild = client.guilds.cache.get(channel.server_id);
        }
        this.client = client;
        if (channel.recipients !== undefined && channel.recipients.length > 0) {
            this.recipient = this.client.users.cache.get(channel.recipients[0].uniqueID);
        }
    }
    send(content, options = {}) {
        return this.client.fetch.send(content, options, this);
    }
    toString() {
        return `<#${this.id}>`;
    }
}
exports.default = Channel;
