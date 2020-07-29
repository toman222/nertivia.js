"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("./Role"));
const collection_1 = __importDefault(require("@discordjs/collection"));
class RolesManager {
    constructor(_guild) {
        this.guild = _guild;
        this.client = this.guild.client;
        this.cache = new collection_1.default();
    }
    create(opts) {
        return this.client.fetch.createRole(opts, this.guild).then(res => {
            const role = new Role_1.default(res, this.guild);
            this.guild.roles.cache.set(res.id, role);
            return role;
        });
    }
}
exports.default = RolesManager;
