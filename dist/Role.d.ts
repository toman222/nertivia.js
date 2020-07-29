import Guild from './Guild';
import Client from './Client';
import { IServerRoleAuth } from './Interfaces/AuthenticationData';
import IRolePermissions from './Interfaces/RolePermissions';
export default class Role {
    guild: Guild;
    client: Client;
    color: string;
    order: number;
    id: string;
    permissions: number;
    name: string;
    constructor(role: IServerRoleAuth, guild: Guild);
    setPermissions(newPerms: IRolePermissions): Promise<this>;
}
