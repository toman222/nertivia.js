import Guild from './Guild';
import Client from './Client';
import Role from './Role';
import Collection from '@discordjs/collection';
export default class RolesManager {
    guild: Guild;
    client: Client;
    cache: Collection<string, Role>;
    constructor(guild: Guild);
    create(opts: {
        data: {
            name: string;
            color: string;
        };
    }): Promise<Role>;
}
