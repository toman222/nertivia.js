"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RolePermissions_1 = require("./constants/RolePermissions");
class Role {
    constructor(role, guild) {
        this.client = guild.client;
        this.guild = guild;
        this.name = role.name;
        this.permissions = role.permissions;
        this.id = role.id;
        this.order = role.order;
        this.color = role.color;
    }
    setPermissions(newPerms) {
        let perms = this.permissions;
        const addPerm = (flag) => { perms |= flag; };
        const removePerm = (flag) => { perms &= ~flag; };
        const newPermsKeys = Object.keys(newPerms);
        for (let index = 0; index < newPermsKeys.length; index++) {
            const permName = newPermsKeys[index];
            const status = newPerms[permName];
            const flag = RolePermissions_1.RolePermissions[permName];
            if (status)
                addPerm(flag);
            else
                removePerm(flag);
        }
        return this.client.fetch.updateRole({ permissions: perms }, this, this.guild).then(() => {
            this.permissions = perms;
            return this;
        });
    }
}
exports.default = Role;
