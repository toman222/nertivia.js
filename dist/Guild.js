"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerMember_1 = __importDefault(require("./ServerMember"));
const constants_1 = require("./constants");
const RolesManager_1 = __importDefault(require("./RolesManager"));
const collection_1 = __importDefault(require("@discordjs/collection"));
class Guild {
    constructor(server, client) {
        this.id = server.server_id;
        this.name = server.name;
        this.icon = server.avatar;
        this.channels = new collection_1.default();
        this.members = new collection_1.default();
        this.client = client;
        this.roles = new RolesManager_1.default(this);
    }
    get iconURL() {
        return constants_1.END_POINTS.NERTIVIA_CDN + this.icon;
    }
    _addMember(data) {
        const user = this.client.dataManager.newUser(data.member);
        if (!user)
            return;
        const sm = new ServerMember_1.default(this.client, this, Object.assign(Object.assign({}, data), { user }));
        this.members.set(user.id, sm);
        return sm;
    }
}
exports.default = Guild;
