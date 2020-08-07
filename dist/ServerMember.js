"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerMember {
    constructor(client, guild, member) {
        this.guild = guild;
        this.user = member.user;
        this.type = member.type;
        this.client = client;
    }
    toString() {
        return `<@${this.user.id}>`;
    }
}
exports.default = ServerMember;
