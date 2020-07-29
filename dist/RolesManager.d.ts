import Guild from './Guild';
import Client from './Client';
import Role from './Role';
import { CreateRoleOpts } from './Interfaces/CreateRole';
import Collection from '@discordjs/collection';
export default class RolesManager {
    guild: Guild;
    client: Client;
    cache: Collection<string, Role>;
    constructor(_guild: Guild);
    create(opts: CreateRoleOpts): Promise<Role>;
}
